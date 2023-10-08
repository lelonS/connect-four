class Network {
  static userName = null;
  static userType = 'human'
  static channel = null;
  static token = null;
  static latest = 0;
  static urlPrefix = 'https://sse.nodehill.com';

  static game = null;
  static playerUsers = {}; // user: playerIndex
  static closeInfo = '';
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
    Network.playerUsers = {};
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
    if (Network.game === null) { Network.closeConnection(); return; }
    if (user === Network.userName) { return; } // Ignore own messages

    // Server message
    if (user === 'system') {
      Network.processMessageFromServer(data);
      return;
    }

    // Incoming message
    if (user !== 'system' && user !== Network.userName) {
      Network.processMessageFromRemote(data, user);
    }
  }

  static #startGame() {
    // If no local player, close connection (Game was already full when joining)
    if (Network.game.players.every(player => !player.isLocal)) {
      Network.closeConnectionAndReset('Game full. Try a different channel');
      return;
    }

    Network.game.waitForMove();
  }

  static sendBoardReset() {
    if (Network.game === null || Network.game.board.moveHistory.length === 0) { return; } // Board already reset
    Network.send('resetBoard');
  }

  static sendMoveFromLocalPlayer(player, move) {
    if (!player.isLocal || Network.eventSource === null) { return; }
    Network.send(move);
  }

  static processMessageFromServer(data) {
    // New player joined (can be self)
    if (data.includes(`joined channel`)) {
      const plrWasCreated = Network.#createPlayer(data);
      // If player was created, and player count is 2, start game
      if (plrWasCreated && Network.game.players.length === Network.game.playerCount) {
        Network.#startGame();
      }
    }

    // Player left
    if (data.includes(`left channel`)) {
      Network.#removePlayer(data);
    }
  }

  static processMessageFromRemote(data, user) {
    // Get player from Network.game.players (if is player1 or player2)
    let player, playerIndex;
    if (user in Network.playerUsers) {
      playerIndex = Network.playerUsers[user];
      player = Network.game.players[playerIndex];
    }

    // If player is not found, or is local player, ignore message
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

  static #createPlayer(data) {
    if (Network.game.players.length >= Network.game.playerCount) { return false; } // Already two players, no plr created
    // data format: "User {name} joined channel '{channel}'."

    const userName = data.substring(5, data.indexOf(' joined channel'));
    const name = Network.plrNameFromUser(userName);
    const plrNumber = Network.game.players.length + 1
    const isLocalPlayer = userName === Network.userName;

    let player = Player.create(name, plrNumber, 'human');
    // If local player, create player with correct playerType
    if (isLocalPlayer) {
      player = Player.create(name, plrNumber, Network.userType);
    }
    player.isLocal = isLocalPlayer;

    Network.game.players.push(player);
    Network.playerUsers[userName] = plrNumber - 1;
    return true; // Player created
  }

  static #removePlayer(data) {
    // data format: "User '{name}' left channel '{channel}'."
    const userName = data.substring(6, data.indexOf('\' left channel'));
    if (!(userName in Network.playerUsers)) { return; } // Player not playing

    // Remove player from Network.game.players
    const playerIndex = Network.playerUsers[userName];
    Network.game.players.splice(playerIndex, 1);
    delete Network.playerUsers[userName];

    // Check player count, if less than 2, close connection
    if (Network.game.players.length < Network.game.playerCount) {
      Network.closeConnectionAndReset('Opponent left the game. Try a different channel');
    }
  }

  static plrNameFromUser(user) {
    if (Player.isValidName(user)) { return user; }

    // If name is invalid, return a valid name (different from Network.userName)
    return Network.userName === 'OnlinePlr' ? 'OnlinePlr2' : 'OnlinePlr';
  }
}