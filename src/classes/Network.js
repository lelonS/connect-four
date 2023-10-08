class Network {
  static userName = null;
  static userType = 'human'
  static channel = null;
  static token = null;
  static latest = 0;
  static urlPrefix = 'https://sse.nodehill.com';

  static game = null;
  static closeInfo = '';
  static gameStarted = false;
  static eventSource = null;

  static startConnection(_user, _userType, _channel, _game) {
    Network.closeConnection();

    Network.userType = _userType;
    Network.userName = _user
    Network.channel = _channel;
    Network.game = _game;

    _game.players = [];

    Network.eventSource = new EventSource(Network.urlPrefix + `/api/listen/${Network.channel}/${Network.userName}/${Network.latest}`);

    Network.eventSource.addEventListener('token', event => {
      Network.token = JSON.parse(event.data);
    });

    Network.eventSource.onmessage = event => {
      Network.messageListener(JSON.parse(event.data));
    }

    Network.eventSource.onerror = error => {
      Network.closeConnectionAndReset('Error: Try a different name or channel');
      // console.log('EventSource onerror:');
      // console.log(error);
    }
  }

  static closeConnectionAndReset(reason = '') {
    const _game = Network.game;
    Network.closeConnection(reason);
    _game.reset();
  }

  static closeConnection(reason = '') {
    Network.closeInfo = reason;
    Network.userName = null;
    Network.channel = null;
    Network.token = null;
    Network.latest = 0;
    Network.game = null;
    Network.gameStarted = false;
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
      const plrWasCreated = Network.createPlayer(data);
      if (plrWasCreated && Network.game.players.length === Network.game.playerCount) {
        // Second player joined, start game

        // If no local player, close connection (Game was already full when joining)
        if (Network.game.players.every(player => !player.isLocal)) {
          Network.closeConnectionAndReset('Game full. Try a different channel');
          return;
        }

        Network.game.waitForMove();
        Network.gameStarted = true;
      }
    }

    // Player left
    if (user === 'system' && data.includes(`left channel`)) {
      Network.removePlayer(data);
      if (Network.game.players.length < Network.game.playerCount && Network.gameStarted) {
        // Less than two players left do something
        Network.closeConnectionAndReset('Opponent left the game. Try a different channel');
      }
    }

    // Incoming message
    if (user !== 'system' && user !== Network.userName) {
      Network.processMessageFromRemote(data, user);
    }
  }

  static sendBoardReset() {
    if (Network.game === null || Network.game.board.moveHistory.length === 0) { return; } // Board already reset
    Network.send('resetBoard');
  }

  static sendMoveFromLocalPlayer(player, move) {
    if (!player.isLocal || Network.eventSource === null) { return; }
    Network.send(move);
  }

  static processMessageFromRemote(data, user) {
    // Get player from Network.game.players (if is player1 or player2)
    let player;
    let playerIndex;
    for (let i = 0; i < Network.game.players.length; i++) {
      if (Network.game.players[i].name === user) {
        player = Network.game.players[i];
        playerIndex = i;
        break;
      }
    }
    if (player === undefined || player.isLocal) { return; }

    // Reset board
    if (data === 'resetBoard') {
      Network.game.reset(false);
      return;
    }

    // Move
    if (Number.isInteger(data) && playerIndex === Network.game.board.turn) {
      Network.game.move(data);
    }
  }

  static createPlayer(data) {
    if (Network.game.players.length >= Network.game.playerCount) { return false; } // Already two players, no plr created
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
    return true; // Player created
  }

  static removePlayer(data) {
    // data format: "User '{name}' left channel '{channel}'."
    const name = data.substring(6, data.indexOf('\' left channel'));
    // Filter out player with name
    Network.game.players = Network.game.players.filter(player => player.name !== name);
  }
}