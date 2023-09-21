class Player {

  static get nameMinLength() { return 1; }
  static get nameMaxLength() { return 10; }
  static get nameRegex() { return /^[a-zA-Z0-9]+$/; }  // Only allow letters and numbers

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