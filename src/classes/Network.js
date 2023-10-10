class Network {
  constructor(_game) {
    this.game = _game;
    this.urlPrefix = 'https://sse.nodehill.com'
    this.closeConnection();
  }

  startConnection(_user, _userType, _channel) {
    this.closeConnection();
    this.isConnected = true;
    this.userType = _userType;
    this.userName = _user
    this.channel = _channel;

    this.game.players = [];

    this.eventSource = new EventSource(this.urlPrefix + `/api/listen/${this.channel}/${this.userName}/${this.latest}`);

    this.eventSource.addEventListener('token', event => {
      this.token = JSON.parse(event.data);
    });

    this.eventSource.onmessage = event => {
      this.messageListener(JSON.parse(event.data));
    }

    this.eventSource.onerror = error => {
      this.closeConnectionAndReset('Error: Try a different name or channel');
      // console.log('EventSource onerror:');
      // console.log(error);
    }
  }

  closeConnectionAndReset(reason = '') {
    this.closeConnection(reason);
    this.game.reset();
  }

  closeConnection(reason = '') {
    this.closeInfo = reason;
    this.isConnected = false;
    this.userName = null;
    this.userType = 'human'
    this.channel = null;
    this.token = null;
    this.latest = 0;
    this.playerUsers = {};
    if (this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = null;
  }

  async send(message) {
    return await (await fetch(this.urlPrefix + `/api/send/${this.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      mode: 'cors'
    })).json();
  }

  messageListener({ timestamp, user, data }) {
    if (!this.isConnected || this.game === null) { this.closeConnection(); return; }
    if (user === this.userName) { return; } // Ignore own messages

    // Server message
    if (user === 'system') {
      this.processMessageFromServer(data);
      return;
    }

    // Incoming message
    if (user !== 'system' && user !== this.userName) {
      this.processMessageFromRemote(data, user);
    }
  }

  #startGame() {
    // If no local player, close connection (Game was already full when joining)
    if (this.game.players.every(player => !player.isLocal)) {
      this.closeConnectionAndReset('Game full. Try a different channel');
      return;
    }

    this.game.waitForMove();
  }

  sendBoardReset() {
    if (!this.isConnected || this.game.board.moveHistory.length === 0) { return; } // Board already reset or no not connected
    this.send('resetBoard');
  }

  sendMoveFromLocalPlayer(player, move) {
    if (!this.isConnected || !player.isLocal) { return; }
    this.send(move);
  }

  processMessageFromServer(data) {
    // New player joined (can be self)
    if (data.includes(`joined channel`)) {
      this.#createPlayer(data);
    }

    // Player left
    if (data.includes(`left channel`)) {
      this.#removePlayer(data);
    }
  }

  processMessageFromRemote(data, user) {
    // Get player from Network.game.players (if is player1 or player2)
    let player, playerIndex;
    if (user in this.playerUsers) {
      playerIndex = this.playerUsers[user];
      player = this.game.players[playerIndex];
    }

    // If player is not found, or is local player, ignore message
    if (player === undefined || player.isLocal) { return; }

    // Reset board
    if (data === 'resetBoard') {
      this.game.reset(false);
      return;
    }

    // Move
    if (Number.isInteger(data) && playerIndex === this.game.board.turn) {
      this.game.move(data);
    }
  }

  #createPlayer(data) {
    if (this.game.players.length >= this.game.playerCount) { return } // Already two players, no plr created
    // data format: "User {name} joined channel '{channel}'."

    const userName = data.substring(5, data.indexOf(' joined channel'));
    const name = this.plrNameFromUser(userName);
    const plrNumber = this.game.players.length + 1
    const isLocalPlayer = userName === this.userName;

    let player = Player.create(name, plrNumber, 'human');
    // If local player, create player with correct playerType
    if (isLocalPlayer) {
      player = Player.create(name, plrNumber, this.userType);
    }
    player.isLocal = isLocalPlayer;

    this.game.players.push(player);
    this.playerUsers[userName] = plrNumber - 1;

    // If two players, start game
    if (this.game.players.length === this.game.playerCount) {
      this.#startGame();
    }
  }

  #removePlayer(data) {
    // data format: "User '{name}' left channel '{channel}'."
    const userName = data.substring(6, data.indexOf('\' left channel'));
    if (!(userName in this.playerUsers)) { return; } // Player not playing

    // Remove player from Network.game.players
    const playerIndex = this.playerUsers[userName];
    this.game.players.splice(playerIndex, 1);
    delete this.playerUsers[userName];

    // Check player count, if less than 2, close connection
    if (this.game.players.length < this.game.playerCount) {
      this.closeConnectionAndReset('Opponent left the game. Try a different channel');
    }
  }

  plrNameFromUser(user) {
    if (Player.isValidName(user)) { return user; }

    // If name is invalid, return a valid name (different from Network.userName)
    return this.userName === 'OnlinePlr' ? 'OnlinePlr2' : 'OnlinePlr';
  }
}