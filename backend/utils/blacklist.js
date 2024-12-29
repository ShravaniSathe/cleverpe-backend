// blacklist.js
const tokenBlacklist = new Set();

module.exports = {
  tokenBlacklist,
  isBlacklisted: (token) => tokenBlacklist.has(token),
  addToBlacklist: (token) => tokenBlacklist.add(token),
};
