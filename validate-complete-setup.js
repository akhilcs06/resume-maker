#!/usr/bin/env node

/**
 * Comprehensive validation script for Resume Maker setup
 * Checks both Clerk authentication and Supabase database integration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Resume Maker Complete Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Required environment variables
const requiredVars = [
  'VITE_CLERK_PUBLISHABLE_KEY',
  'VITE_SUPABASE_URL', 
  'VITE_SUPABASE_ANON_KEY'
];

console.log('📋 Checking environment variables:');
let allVarsValid = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`❌ ${varName}: Not configured`);
    allVarsValid = false;
  } else {
    console.log(`✅ ${varName}: Configured`);
  }
});

// Check Clerk key format
if (envVars.VITE_CLERK_PUBLISHABLE_KEY && !envVars.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_')) {
  console.log('⚠️  VITE_CLERK_PUBLISHABLE_KEY should start with "pk_"');
  allVarsValid = false;
}

// Check Supabase URL format
if (envVars.VITE_SUPABASE_URL && !envVars.VITE_SUPABASE_URL.includes('supabase.co')) {
  console.log('⚠️  VITE_SUPABASE_URL should be a supabase.co domain');
  allVarsValid = false;
}

console.log('\n📦 Checking required dependencies:');

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

const requiredDeps = [
  '@clerk/clerk-react',
  '@supabase/supabase-js',
  'react-router-dom',
  'styled-components',
  'react',
  'react-dom'
];

requiredDeps.forEach(dep => {
  if (dependencies[dep]) {
    console.log(`✅ ${dep}: ${dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep}: Missing`);
    allVarsValid = false;
  }
});

console.log('\n🗂️  Checking required files:');

const requiredFiles = [
  // Core App
  'src/App.tsx',
  'src/main.tsx',
  
  // Authentication Components
  'src/components/Header.tsx',
  'src/components/ProtectedRoute.tsx',
  'src/components/Landing.tsx',
  'src/components/Dashboard.tsx',
  'src/components/ProfileWidget.tsx',
  
  // Supabase Integration
  'src/lib/supabase.ts',
  'src/hooks/useSupabase.ts',
  'src/components/SupabaseTest.tsx',
  
  // Hooks & Services
  'src/hooks/useUserData.ts',
  'src/services/api.ts',
  
  // Database & Documentation
  'database/migrations/001_initial_schema.sql',
  'CLERK_SETUP.md',
  'SUPABASE_SETUP.md',
  'README.md'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}: Missing`);
    allVarsValid = false;
  }
});

console.log('\n📊 Feature Validation:');

// Check if components have the required integrations
const checkFileContains = (filePath, searchText, description) => {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
    if (content.includes(searchText)) {
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`❌ ${description}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} (file not readable)`);
    return false;
  }
};

// Feature checks
const featureChecks = [
  ['src/App.tsx', 'ClerkProvider', 'Clerk authentication provider configured'],
  ['src/App.tsx', 'react-router-dom', 'React Router integration'],
  ['src/components/Dashboard.tsx', 'SupabaseTest', 'Supabase test component integrated'],
  ['src/hooks/useSupabase.ts', 'getToken', 'Clerk-Supabase authentication integration'],
  ['src/lib/supabase.ts', 'createClient', 'Supabase client configuration']
];

featureChecks.forEach(([file, search, desc]) => {
  checkFileContains(file, search, desc);
});

console.log('\n📋 Setup Summary:');

if (allVarsValid) {
  console.log('🎉 Core setup requirements are met!');
  
  const hasSupabaseConfig = envVars.VITE_SUPABASE_URL && 
                           !envVars.VITE_SUPABASE_URL.includes('your_') &&
                           envVars.VITE_SUPABASE_ANON_KEY &&
                           !envVars.VITE_SUPABASE_ANON_KEY.includes('your_');
  
  if (hasSupabaseConfig) {
    console.log('✅ Supabase configuration appears complete');
    console.log('\n📝 Next steps:');
    console.log('1. Run your app: npm run dev');
    console.log('2. Sign in and test the Supabase Test component');
    console.log('3. Verify database operations work correctly');
  } else {
    console.log('⚠️  Supabase configuration needed');
    console.log('\n📝 Next steps:');
    console.log('1. Follow SUPABASE_SETUP.md to configure your Supabase project');
    console.log('2. Update .env.local with your Supabase URL and API key');
    console.log('3. Run the database migration script');
    console.log('4. Configure Clerk JWT template for Supabase');
  }
} else {
  console.log('⚠️  Some requirements are missing. Please check the issues above.');
  console.log('\n📖 Setup Guides:');
  console.log('- CLERK_SETUP.md - Clerk authentication setup');
  console.log('- SUPABASE_SETUP.md - Supabase database setup');
  console.log('- README.md - Complete project overview');
}

console.log('\n🔗 Helpful Links:');
console.log('- Clerk Dashboard: https://dashboard.clerk.com');
console.log('- Supabase Dashboard: https://supabase.com/dashboard');

console.log('\n🧪 Testing:');
console.log('- Authentication: Use sign-in/sign-up flow');
console.log('- Database: Use the SupabaseTest component in your Dashboard');
console.log('- Integration: Verify user data persists across sessions');

console.log('\n🚀 Your Resume Maker is almost ready!');
