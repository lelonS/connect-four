// EventSource mock
class EventSource {
  constructor(url) {
    this.url = url;
    this.addEventListener = jest.fn();
    this.onmessage = null;
    this.onerror = null;
    this.close = jest.fn();
  }
}


function messageObject(user, message) {
  return { timestamp: 0, user, data: message };
}

function joinMessage(user, channel) {
  return messageObject('system', `User ${user} joined channel '${channel}'.`);
}

function leaveMessage(user, channel) {
  return messageObject('system', `User '${user}' left channel '${channel}'.`);
}


module.exports = {
  EventSource,
  messageObject,
  joinMessage,
  leaveMessage
};