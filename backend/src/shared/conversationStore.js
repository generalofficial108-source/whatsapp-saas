const conversations = {};

function addMessage(user, message) {
  if (!conversations[user]) {
    conversations[user] = [];
  }

  conversations[user].push({
    id: Date.now(),
    timestamp: new Date(),
    ...message
  });
}

function getUsers() {
  return Object.keys(conversations);
}

function getMessages(user) {
  return conversations[user] || [];
}

module.exports = {
  addMessage,
  getUsers,
  getMessages
};