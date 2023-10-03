class Network {
  static user = null;
  static channel = null;
  static token = null;
  static latest = 0;
  static urlPrefix = 'https://sse.nodehill.com';

  static game = null;
  static eventSource = null;

  static startConnection(_user, _channel, _game) {

    Network.user = _user
    Network.channel = _channel;
    Network.game = _game;

    Network.eventSource = new EventSource(Network.urlPrefix + `/api/listen/${Network.channel}/${Network.user}/${Network.latest}`);

    Network.eventSource.addEventListener('token', event => {
      Network.token = JSON.parse(event.data);
    });

    Network.eventSource.onmessage = event => {
      Network.messageListener(JSON.parse(event.data));
    }

    Network.eventSource.onerror = error => {
      Network.eventSource.close();
      setTimeout(startConnection, 1000)
    }
  }

  static closeConnection() {
    Network.user = null;
    Network.channel = null;
    Network.token = null;
    Network.latest = 0;
    Network.game = null;
    if (Network.eventSource) {
      Network.eventSource.close();
      Network.eventSource = null;
    }
  }

  static async send(message) {
    return await (await fetch(Network.urlPrefix + `/api/send/${Network.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      mode: 'cors'
    })).json();
  }

  static messageListener({ timestamp, user, data }) {
    console.log(timestamp, user, data);
  }

  static sendMoveFromLocalPlayer(player, move) {
    if (!player.isLocal) { return; }
  }

  static makeMoveFromRemote(move, user) {
    console.log(move, user);
  }

  static createPlayer(data) {
    // Create player from system join message
    console.log(data);
  }

  static removePlayer(data) {
    // Remove player from system leave message
    console.log(data);
  }
}