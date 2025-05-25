-- Migration: Create ResumeMaker database schema with RLS
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resume_templates table
CREATE TABLE IF NOT EXISTS resume_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    structure JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL, -- This will store Clerk user ID
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    template_id UUID REFERENCES resume_templates(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_resume_templates_tags ON resume_templates USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can insert their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON resumes;

DROP POLICY IF EXISTS "Anyone can view resume templates" ON resume_templates;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);

-- RLS Policies for resumes
CREATE POLICY "Users can view their own resumes"
    ON resumes FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own resumes"
    ON resumes FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own resumes"
    ON resumes FOR UPDATE
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own resumes"
    ON resumes FOR DELETE
    USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for resume_templates (public read access)
CREATE POLICY "Anyone can view resume templates"
    ON resume_templates FOR SELECT
    TO authenticated, anon
    USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some default resume templates
INSERT INTO resume_templates (name, structure, tags, is_premium) VALUES
(
    'Modern Professional',
    '{
        "layout": "modern",
        "colors": {
            "primary": "#2563eb",
            "secondary": "#64748b",
            "accent": "#06b6d4"
        },
        "sections": ["header", "summary", "experience", "education", "skills"],
        "fonts": {
            "heading": "Inter",
            "body": "System UI"
        }
    }',
    ARRAY['professional', 'modern', 'clean'],
    false
),
(
    'Creative Designer',
    '{
        "layout": "creative",
        "colors": {
            "primary": "#7c3aed",
            "secondary": "#ec4899",
            "accent": "#f59e0b"
        },
        "sections": ["header", "portfolio", "experience", "skills", "education"],
        "fonts": {
            "heading": "Poppins",
            "body": "Open Sans"
        }
    }',
    ARRAY['creative', 'design', 'portfolio'],
    false
),
(
    'Executive Classic',
    '{
        "layout": "executive",
        "colors": {
            "primary": "#1f2937",
            "secondary": "#6b7280",
            "accent": "#059669"
        },
        "sections": ["header", "executive_summary", "experience", "achievements", "education"],
        "fonts": {
            "heading": "Georgia",
            "body": "Times New Roman"
        }
    }',
    ARRAY['executive', 'senior', 'traditional'],
    true
);

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
