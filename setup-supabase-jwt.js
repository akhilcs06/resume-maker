#!/usr/bin/env node

/**
 * Supabase JWT Configuration Helper
 * This script helps configure Supabase to accept Clerk JWT tokens
 */

const chalk = require('chalk');

console.log(chalk.blue('🔧 Supabase JWT Configuration Helper\n'));

// Get the JWKS URL from environment
const publishableKey = process.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
    console.log(chalk.red('❌ Missing VITE_CLERK_PUBLISHABLE_KEY in environment'));
    process.exit(1);
}

// Extract the domain from the publishable key
const keyMatch = publishableKey.match(/pk_test_(.+?)\.clerk\.accounts\.dev/);
if (!keyMatch) {
    console.log(chalk.red('❌ Could not extract domain from Clerk publishable key'));
    process.exit(1);
}

const clerkDomain = keyMatch[1] + '.clerk.accounts.dev';
const jwksUrl = `https://${clerkDomain}/.well-known/jwks.json`;

console.log(chalk.green('✅ Detected Clerk configuration:'));
console.log(`   Domain: ${clerkDomain}`);
console.log(`   JWKS URL: ${jwksUrl}\n`);

console.log(chalk.yellow('📋 Supabase Configuration Steps:\n'));

console.log('1. ' + chalk.bold('Open Supabase Dashboard'));
console.log('   → Go to https://supabase.com/dashboard');
console.log('   → Select your project\n');

console.log('2. ' + chalk.bold('Navigate to Authentication Settings'));
console.log('   → Go to Authentication → Settings');
console.log('   → Scroll down to "JWT Settings"\n');

console.log('3. ' + chalk.bold('Configure JWT Settings'));
console.log('   → Set "JWT Secret" to: ' + chalk.cyan('Use a custom JWKS endpoint'));
console.log('   → Set "JWKS URL" to: ' + chalk.cyan(jwksUrl));
console.log('   → Click "Save"\n');

console.log('4. ' + chalk.bold('Verify JWT Template in Clerk'));
console.log('   → Go to https://dashboard.clerk.com');
console.log('   → Navigate to JWT Templates');
console.log('   → Ensure you have a template named "supabase"');
console.log('   → Template should have audience: "authenticated"\n');

console.log(chalk.green('5. Test the Configuration'));
console.log('   → Return to your app and try the user profile sync');
console.log('   → The RLS errors should be resolved\n');

console.log(chalk.blue('🔍 Debugging Tips:'));
console.log('   • If still getting RLS errors, check the JWT claims in browser DevTools');
console.log('   • Ensure the "sub" field matches your user ID');
console.log('   • Verify the audience is "authenticated"');
console.log('   • Check Supabase logs for more detailed error messages\n');

console.log(chalk.magenta('📋 Quick Reference:'));
console.log(`   JWKS URL: ${jwksUrl}`);
console.log(`   JWT Template Name: supabase`);
console.log(`   Audience: authenticated`);
console.log(`   Subject Claim: sub (contains Clerk user ID)\n`);
