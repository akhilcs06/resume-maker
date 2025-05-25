/**
 * Supabase Setup Validation Script
 * Run this script to validate your Supabase integration
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

console.log(chalk.blue.bold('\n🔧 Validating Supabase Setup for Resume Maker\n'));

// Check 1: Environment Variables
console.log(chalk.yellow('📋 Checking environment variables...'));

const envFiles = ['.env', '.env.local', '.env.development'];
let envFound = false;
let supabaseVars = {};

for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
        envFound = true;
        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log(chalk.green(`✓ Found ${envFile}`));
        
        // Check for required variables
        if (envContent.includes('VITE_SUPABASE_URL')) {
            supabaseVars.url = true;
            console.log(chalk.green('✓ VITE_SUPABASE_URL found'));
        }
        if (envContent.includes('VITE_SUPABASE_ANON_KEY')) {
            supabaseVars.anonKey = true;
            console.log(chalk.green('✓ VITE_SUPABASE_ANON_KEY found'));
        }
        if (envContent.includes('VITE_CLERK_PUBLISHABLE_KEY')) {
            supabaseVars.clerkKey = true;
            console.log(chalk.green('✓ VITE_CLERK_PUBLISHABLE_KEY found'));
        }
    }
}

if (!envFound) {
    console.log(chalk.red('✗ No environment file found. Create .env.local with your Supabase credentials.'));
    console.log(chalk.yellow('  Use .env.example as a template.'));
}

// Check 2: Required Files
console.log(chalk.yellow('\n📋 Checking required files...'));

const requiredFiles = [
    'src/lib/supabase.ts',
    'src/hooks/useSupabase.ts',
    'src/hooks/useSupabaseUserSync.ts',
    'src/services/api.ts',
    'database/migrations/001_initial_schema.sql'
];

let allFilesExist = true;
for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(chalk.green(`✓ ${file}`));
    } else {
        console.log(chalk.red(`✗ ${file} - Missing file`));
        allFilesExist = false;
    }
}

// Check 3: Package Dependencies
console.log(chalk.yellow('\n📋 Checking package dependencies...'));

const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = [
        '@supabase/supabase-js',
        '@clerk/clerk-react'
    ];
    
    for (const dep of requiredDeps) {
        if (dependencies[dep]) {
            console.log(chalk.green(`✓ ${dep} - ${dependencies[dep]}`));
        } else {
            console.log(chalk.red(`✗ ${dep} - Missing dependency`));
        }
    }
} else {
    console.log(chalk.red('✗ package.json not found'));
}

// Check 4: TypeScript Types
console.log(chalk.yellow('\n📋 Checking TypeScript integration...'));

const supabaseTypesPath = path.join(process.cwd(), 'src/lib/supabase.ts');
if (fs.existsSync(supabaseTypesPath)) {
    const content = fs.readFileSync(supabaseTypesPath, 'utf8');
    
    if (content.includes('interface Database')) {
        console.log(chalk.green('✓ Database types defined'));
    } else {
        console.log(chalk.yellow('⚠ Database interface not found - you may need to generate types'));
    }
    
    if (content.includes('resumes') && content.includes('resume_templates')) {
        console.log(chalk.green('✓ Table types defined'));
    } else {
        console.log(chalk.red('✗ Table types missing'));
    }
}

// Summary
console.log(chalk.blue.bold('\n📊 Setup Summary'));

const allReady = envFound && 
                supabaseVars.url && 
                supabaseVars.anonKey && 
                supabaseVars.clerkKey && 
                allFilesExist;

if (allReady) {
    console.log(chalk.green.bold('🎉 Supabase setup looks good!'));
    console.log(chalk.green('\nNext steps:'));
    console.log(chalk.white('1. Run the database migration in Supabase SQL Editor'));
    console.log(chalk.white('2. Configure Clerk JWT template for Supabase'));
    console.log(chalk.white('3. Test the integration using the SupabaseTest component'));
    console.log(chalk.white('4. Start your dev server: npm run dev'));
} else {
    console.log(chalk.red.bold('❌ Setup incomplete'));
    console.log(chalk.yellow('\nPlease fix the issues above before proceeding.'));
    console.log(chalk.yellow('Refer to SUPABASE_SETUP.md for detailed instructions.'));
}

console.log(chalk.blue('\n📚 Resources:'));
console.log(chalk.white('• Setup Guide: ./SUPABASE_SETUP.md'));
console.log(chalk.white('• Database Schema: ./database/migrations/001_initial_schema.sql'));
console.log(chalk.white('• Environment Template: ./.env.example'));
console.log(chalk.white('• Supabase Dashboard: https://supabase.com/dashboard'));
console.log(chalk.white('• Clerk Dashboard: https://dashboard.clerk.com'));

console.log('');
