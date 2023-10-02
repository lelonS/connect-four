class Player {

  static get PlayerTypes() { return { Human: 'human', RandomBot: 'random-bot', SmartBot: 'smart-bot' }; }
  static get nameMinLength() { return 1; }
  static get nameMaxLength() { return 10; }
  static get nameRegex() { return RegExp('^[a-zA-Z0-9]+$'); }  // Only allow letters and numbers

  static create(name, plrNumber, playerType) {
    switch (playerType) {
      case Player.PlayerTypes.Human:
        return new Player(name, plrNumber);
      case Player.PlayerTypes.RandomBot:
        return new RandomBot(name, plrNumber);
      case Player.PlayerTypes.SmartBot:
        return new SmartBot(name, plrNumber);
      default:
        throw new Error('Invalid player type: ' + playerType);
    }
  }

  static isValidName(name) {
    if (typeof name !== 'string') { return false; }

    if (name.length < Player.nameMinLength || name.length > Player.nameMaxLength) { return false; }
    if (!name.match(Player.nameRegex)) { return false; }
    return true;
  }

  #name;
  constructor(name, plrNumber) {
    this.name = name;
    this.plrNumber = plrNumber;
  }

  get name() { return this.#name; }

  set name(name) {
    if (!Player.isValidName(name)) {
      throw new Error('Invalid player name: "' + name + '"');
    }
    this.#name = name;
  }

  toString() {
    return this.name + ' (' + this.plrNumber + ')';
  }
}