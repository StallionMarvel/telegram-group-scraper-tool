// Core scraper module for Telegram groups
// Uses MTProto API to fetch group members with pagination

const { MTProto } = require('mtproto');
const config = require('./config');
const logger = require('./logger');

// Initialize MTProto client
const api = new MTProto({
  api_id: config.apiId,
  api_hash: config.apiHash,
});

/**
 * Scrapes members from a Telegram group
 * @param {string|number} group - Group username (e.g., @example) or numeric ID
 * @returns {Promise<Array>} Array of member objects with id, username, firstName, lastName
 */
async function scrapeMembers(group) {
  logger.info(`Starting scrape for group: ${group}`);
  
  // Resolve peer (convert username to ID if needed)
  let peer;
  if (typeof group === 'string') {
    const resolved = await api.call('contacts.resolveUsername', {
      username: group.replace('@', ''),
    });
    peer = resolved.peer;
  } else {
    peer = { _: 'peerChannel', channel_id: group };
  }
  
  const allMembers = [];
  let offset = 0;
  const limit = 200; // Max per request
  
  while (allMembers.length < config.maxMembers) {
    logger.debug(`Fetching members with offset ${offset}...`);
    
    const result = await api.call('channels.getParticipants', {
      channel: peer,
      filter: { _: 'channelParticipantsRecent' },
      offset: offset,
      limit: limit,
      hash: 0,
    });
    
    if (!result.participants || result.participants.length === 0) {
      logger.info('No more participants to fetch.');
      break;
    }
    
    // Extract user details from participants
    const users = result.users || [];
    const userMap = {};
    for (const user of users) {
      userMap[user.id] = user;
    }
    
    for (const participant of result.participants) {
      const user = userMap[participant.user_id];
      if (user && !user.deleted) {
        allMembers.push({
          id: user.id,
          username: user.username || null,
          firstName: user.first_name || null,
          lastName: user.last_name || null,
        });
      }
    }
    
    offset += limit;
    
    // Respect rate limits
    await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests));
  }
  
  logger.info(`Scrape completed. Total members: ${allMembers.length}`);
  return allMembers;
}

module.exports = { scrapeMembers };
