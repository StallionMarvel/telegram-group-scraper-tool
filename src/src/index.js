// Entry point for the Telegram group member scraper tool
// Initializes configuration and starts the scraping process

const config = require('./config');
const scraper = require('./scraper');
const logger = require('./logger');

async function main() {
  logger.info('Telegram Group Scraper Tool starting...');
  
  // Validate configuration
  if (!config.apiId || !config.apiHash) {
    logger.error('Missing API credentials. Please set API_ID and API_HASH environment variables.');
    process.exit(1);
  }
  
  const targetGroup = config.groupUsername || config.groupId;
  if (!targetGroup) {
    logger.error('No target group specified. Provide GROUP_USERNAME or GROUP_ID in environment.');
    process.exit(1);
  }
  
  try {
    const members = await scraper.scrapeMembers(targetGroup);
    logger.info(`Scraped ${members.length} members from group ${targetGroup}`);
    
    // Output results to console (or could save to file)
    console.log(JSON.stringify(members, null, 2));
  } catch (err) {
    logger.error(`Scraping failed: ${err.message}`);
    process.exit(1);
  }
}

main();
