// Basic test suite for Telegram group scraper tool
// Tests configuration and logger modules (no API calls to avoid dependencies)

const assert = require('assert');
const config = require('../src/config');
const logger = require('../src/logger');

// Test config defaults
function testConfigDefaults() {
  console.log('Testing config defaults...');
  
  // Save original env
  const originalEnv = { ...process.env };
  
  // Clear env variables for this test
  delete process.env.API_ID;
  delete process.env.API_HASH;
  delete process.env.GROUP_USERNAME;
  delete process.env.GROUP_ID;
  delete process.env.MAX_MEMBERS;
  delete process.env.DELAY_MS;
  
  // Re-require config to get fresh defaults
  delete require.cache[require.resolve('../src/config')];
  const freshConfig = require('../src/config');
  
  assert.strictEqual(freshConfig.apiId, null, 'apiId should be null by default');
  assert.strictEqual(freshConfig.apiHash, null, 'apiHash should be null by default');
  assert.strictEqual(freshConfig.groupUsername, null, 'groupUsername should be null by default');
  assert.strictEqual(freshConfig.groupId, null, 'groupId should be null by default');
  assert.strictEqual(freshConfig.maxMembers, 1000, 'maxMembers should default to 1000');
  assert.strictEqual(freshConfig.delayBetweenRequests, 1000, 'delay should default to 1000ms');
  
  // Restore env
  process.env = originalEnv;
  console.log('  Config defaults: PASS');
}

// Test config with environment variables
function testConfigWithEnv() {
  console.log('Testing config with environment variables...');
  
  process.env.API_ID = '12345';
  process.env.API_HASH = 'abcdef123456';
  process.env.GROUP_USERNAME = '@testgroup';
  process.env.MAX_MEMBERS = '500';
  process.env.DELAY_MS = '2000';
  
  delete require.cache[require.resolve('../src/config')];
  const freshConfig = require('../src/config');
  
  assert.strictEqual(freshConfig.apiId, '12345', 'apiId should match env');
  assert.strictEqual(freshConfig.apiHash, 'abcdef123456', 'apiHash should match env');
  assert.strictEqual(freshConfig.groupUsername, '@testgroup', 'groupUsername should match env');
  assert.strictEqual(freshConfig.maxMembers, 500, 'maxMembers should be 500');
  assert.strictEqual(freshConfig.delayBetweenRequests, 2000, 'delay should be 2000ms');
  
  delete process.env.API_ID;
  delete process.env.API_HASH;
  delete process.env.GROUP_USERNAME;
  delete process.env.MAX_MEMBERS;
  delete process.env.DELAY_MS;
  
  console.log('  Config with env: PASS');
}

// Test logger levels
function testLoggerLevels() {
  console.log('Testing logger levels...');
  
  // Capture console output
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  let logOutput = [];
  console.log = (msg) => logOutput.push({ level: 'log', msg });
  console.warn = (msg) => logOutput.push({ level: 'warn', msg });
  console.error = (msg) => logOutput.push({ level: 'error', msg });
  
  // Test with INFO level (default)
  delete require.cache[require.resolve('../src/logger')];
  const testLogger = require('../src/logger');
  
  testLogger.debug('debug msg');
  testLogger.info('info msg');
  testLogger.warn('warn msg');
  testLogger.error('error msg');
  
  // Debug should be suppressed at INFO level
  const debugMessages = logOutput.filter(m => m.msg.includes('debug msg'));
  assert.strictEqual(debugMessages.length, 0, 'Debug should not appear at INFO level');
  
  // Info, warn, error should appear
  const infoMessages = logOutput.filter(m => m.msg.includes('info msg'));
  assert.strictEqual(infoMessages.length, 1, 'Info should appear once');
  
  const warnMessages = logOutput.filter(m => m.msg.includes('warn msg'));
  assert.strictEqual(warnMessages.length, 1, 'Warn should appear once');
  
  const errorMessages = logOutput.filter(m => m.msg.includes('error msg'));
  assert.strictEqual(errorMessages.length, 1, 'Error should appear once');
  
  // Restore console
  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;
  
  console.log('  Logger levels: PASS');
}

// Run all tests
try {
  testConfigDefaults();
  testConfigWithEnv();
  testLoggerLevels();
  console.log('\nAll tests passed!');
} catch (err) {
  console.error('Test failed:', err.message);
  process.exit(1);
}
