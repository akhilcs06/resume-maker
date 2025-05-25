// Validation script for Clerk authentication setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Clerk Authentication Setup...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file exists');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('VITE_CLERK_PUBLISHABLE_KEY')) {
        console.log('✅ VITE_CLERK_PUBLISHABLE_KEY found in .env.local');
        
        const keyMatch = envContent.match(/VITE_CLERK_PUBLISHABLE_KEY=(.+)/);
        if (keyMatch && keyMatch[1] && keyMatch[1].startsWith('pk_')) {
            console.log('✅ Publishable key format looks correct');
        } else {
            console.log('⚠️  Publishable key format may be incorrect (should start with "pk_")');
        }
    } else {
        console.log('❌ VITE_CLERK_PUBLISHABLE_KEY not found in .env.local');
    }
} else {
    console.log('❌ .env.local file not found');
}

// Check package.json dependencies
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = [
        '@clerk/clerk-react',
        'react-router-dom',
        'styled-components',
        'react',
        'react-dom'
    ];
    
    console.log('\n📦 Checking dependencies:');
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`❌ ${dep}: Not found`);
        }
    });
}

// Check key files exist
const requiredFiles = [
    'src/App.tsx',
    'src/components/Header.tsx',
    'src/components/Dashboard.tsx',
    'src/components/ProtectedRoute.tsx',
    'src/components/Landing.tsx',
    'src/components/ProfileWidget.tsx',
    'src/hooks/useUserData.ts',
    'src/services/api.ts'
];

console.log('\n📁 Checking authentication files:');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file}: Missing`);
    }
});

console.log('\n🚀 Validation complete!');
console.log('\nNext steps:');
console.log('1. Make sure you have a Clerk account and application set up');
console.log('2. Add your actual publishable key to .env.local');
console.log('3. Run "npm run dev" to start the development server');
console.log('4. Test authentication at http://localhost:5173');

console.log('\n📚 Documentation:');
console.log('- Setup guide: ./CLERK_SETUP.md');
console.log('- Testing guide: ./TESTING_AUTH.md');
console.log('- Main README: ./README.md');
