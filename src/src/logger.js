// Simple logger module with timestamp and levels

const levels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLevel = process.env.LOG_LEVEL ? levels[process.env.LOG_LEVEL.toUpperCase()] : levels.INFO;

function timestamp() {
  return new Date().toISOString();
}

function debug(msg) {
  if (currentLevel <= levels.DEBUG) {
    console.log(`[${timestamp()}] [DEBUG] ${msg}`);
  }
}

function info(msg) {
  if (currentLevel <= levels.INFO) {
    console.log(`[${timestamp()}] [INFO] ${msg}`);
  }
}

function warn(msg) {
  if (currentLevel <= levels.WARN) {
    console.warn(`[${timestamp()}] [WARN] ${msg}`);
  }
}

function error(msg) {
  if (currentLevel <= levels.ERROR) {
    console.error(`[${timestamp()}] [ERROR] ${msg}`);
  }
}

module.exports = { debug, info, warn, error };
