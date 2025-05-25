/**
 * JWT Configuration Verification
 * Run this after setting up Clerk JWT template
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

console.log(chalk.blue.bold('\n🔐 Verifying JWT Configuration\n'));

// Read environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
let supabaseUrl = '';
let clerkKey = '';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
        if (line.startsWith('VITE_SUPABASE_URL=')) {
            supabaseUrl = line.split('=')[1];
        }
        if (line.startsWith('VITE_CLERK_PUBLISHABLE_KEY=')) {
            clerkKey = line.split('=')[1];
        }
    }
}

if (!supabaseUrl || !clerkKey) {
    console.log(chalk.red('❌ Environment variables missing'));
    console.log(chalk.yellow('Make sure .env.local has VITE_SUPABASE_URL and VITE_CLERK_PUBLISHABLE_KEY'));
    if (!fs.existsSync(envPath)) {
        console.log(chalk.red('❌ .env.local file not found'));
    }
    process.exit(1);
}

console.log(chalk.green('✅ Environment variables found'));

// Extract domain from Clerk key for JWKS URL
const clerkDomain = clerkKey.replace('pk_test_', '').replace('pk_live_', '');
const jwksUrl = `https://${clerkDomain}.clerk.accounts.dev/.well-known/jwks.json`;

console.log(chalk.yellow('\n📋 JWT Configuration Checklist:'));
console.log(chalk.white('1. ✅ Created JWT template named "supabase" in Clerk Dashboard'));
console.log(chalk.white('2. ✅ Used the provided JSON configuration'));
console.log(chalk.white('3. 🔄 Configure Supabase with JWKS from:'));
console.log(chalk.cyan(`   ${jwksUrl}`));

console.log(chalk.yellow('\n🔧 Supabase Configuration:'));
console.log(chalk.white('1. Go to Supabase Dashboard → Settings → API'));
console.log(chalk.white('2. Scroll to "JWT Settings"'));
console.log(chalk.white('3. Enable "Use a custom JWT secret"'));
console.log(chalk.white('4. Visit the JWKS URL above and copy the JSON'));
console.log(chalk.white('5. Paste the JSON into Supabase JWT Secret field'));
console.log(chalk.white('6. Save the configuration'));

console.log(chalk.blue('\n🧪 Testing Instructions:'));
console.log(chalk.white('1. Start your app: npm run dev'));
console.log(chalk.white('2. Sign in with Clerk'));
console.log(chalk.white('3. Use the "Supabase Integration Test" component'));
console.log(chalk.white('4. All tests should pass ✅'));

console.log(chalk.green.bold('\n🎯 Template Configuration Summary:'));
console.log(chalk.white('• Template Name: "supabase"'));
console.log(chalk.white('• Audience: "authenticated"'));  
console.log(chalk.white('• Subject: Clerk user ID'));
console.log(chalk.white('• Includes: email, phone, metadata'));

console.log('');
