// Configuration module for Telegram scraper
// Reads environment variables and provides defaults

const config = {
  // Telegram API credentials (required)
  apiId: process.env.API_ID || null,
  apiHash: process.env.API_HASH || null,
  
  // Target group identifier (username or numeric ID)
  groupUsername: process.env.GROUP_USERNAME || null,
  groupId: process.env.GROUP_ID || null,
  
  // Scraping options
  maxMembers: parseInt(process.env.MAX_MEMBERS, 10) || 1000,
  delayBetweenRequests: parseInt(process.env.DELAY_MS, 10) || 1000,
};

// Validate numeric group ID if provided
if (config.groupId) {
  config.groupId = parseInt(config.groupId, 10);
  if (isNaN(config.groupId)) {
    throw new Error('GROUP_ID must be a number');
  }
}

module.exports = config;
