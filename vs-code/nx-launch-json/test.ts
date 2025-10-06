#!/usr/bin/env node

/**
 * Test script to demonstrate the NxLaunchConfigGenerator usage
 */

import { NxLaunchConfigGenerator, generateNxLaunchJson } from './cli';
import { join } from 'path';

async function runTests() {
  console.log('🧪 Testing NxLaunchConfigGenerator...\n');

  try {
    // Test 1: Using specific workspace path
    console.log('Test 1: Generating with specific workspace path');
    const workspacePath = join(__dirname, '../..', '21.6.3', 'nx-next-fastify', 'my-project');
    console.log(`Workspace: ${workspacePath}`);
    
    const generator = new NxLaunchConfigGenerator(workspacePath);
    await generator.generateLaunchJson();
    
    console.log('✅ Test 1 passed!\n');

    // Test 2: Using convenience function
    console.log('Test 2: Using convenience function');
    await generateNxLaunchJson(workspacePath);
    console.log('✅ Test 2 passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }

  console.log('🎉 All tests passed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };