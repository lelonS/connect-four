class Network {
  static userName = null;
  static userType = 'human'
  static channel = null;
  static token = null;
  static latest = 0;
  static urlPrefix = 'https://sse.nodehill.com';

  static game = null;
  static eventSource = null;

  static startConnection(_user, _userType, _channel, _game) {
    Network.userType = _userType;
    Network.userName = _user
    Network.channel = _channel;
    Network.game = _game;

    Network.eventSource = new EventSource(Network.urlPrefix + `/api/listen/${Network.channel}/${Network.userName}/${Network.latest}`);

    Network.eventSource.addEventListener('token', event => {
      Network.token = JSON.parse(event.data);
    });

    Network.eventSource.onmessage = event => {
      Network.messageListener(JSON.parse(event.data));
    }

    Network.eventSource.onerror = error => {
      // TODO: Handle error good
      Network.closeConnection();
      console.log('EventSource onerror:');
      console.log(error);
    }
  }

  static closeConnection() {
    Network.userName = null;
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
    if (Network.game === null) { Network.closeConnection(); return; }
    if (user === Network.userName) { return; } // Ignore own messages

    // New player joined (can be self)
    if (user === 'system' && data.includes(`joined channel`)) {
      Network.createPlayer(data);
      if (Network.game.players.length === Network.game.playerCount) {
        // Second player joined, start game
        Network.game.waitForMove();
      }
    }

    // Player left (can be self) 
    if (user === 'system' && data.includes(`left channel`)) {
      Network.removePlayer(data);
      if (Network.game.players.length < Network.game.playerCount) {
        // Less than two players left do something
        Network.closeConnection();
      }
    }

    // Move made
    if (user !== 'system') {
      Network.makeMoveFromRemote(data, user);
    }
  }

  static sendMoveFromLocalPlayer(player, move) {
    if (!player.isLocal || Network.eventSource === null) { return; }
    Network.send(move);
  }

  static makeMoveFromRemote(move, user) {
    // Get player from Network.game.players (if is player1 or player2)
    let player;
    for (let i = 0; i < Network.game.playerCount; i++) {
      if (Network.game.players[i].name === user) {
        player = Network.game.players[i];
        break;
      }
    }
    if (player === undefined || player.isLocal) { return; }
    // Make move
    Network.game.move(move);
  }

  static createPlayer(data) {
    console.log(data);
    // data format: "User {name} joined channel '{channel}'."

    // Get name (between 'User ' and ' joined channel')
    const name = data.substring(5, data.indexOf(' joined channel'));
    const plrNumber = Network.game.players.length + 1
    let player = Player.create(name, plrNumber, 'human');
    const isLocalPlayer = name === Network.userName;
    if (isLocalPlayer) {
      player = Player.create(name, plrNumber, Network.userType);
    }
    player.isLocal = isLocalPlayer;
    Network.game.players.push(player);

    console.log(Network.game.players);
  }

  static removePlayer(data) {
    // data format: "User '{name}' left channel '{channel}'."
    const name = data.substring(6, data.indexOf('\' left channel'));
    // Filter out player with name
    Network.game.players = Network.game.players.filter(player => player.name !== name);
  }
}