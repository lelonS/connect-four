class Player {

  static isValidName(name) {
    if (typeof name !== 'string') { return false; }
    // Only allow letters in name.
    if (!name.match(/^[a-zA-Z]+$/)) { return false; }
    return true;
  }

  #name;
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

  get name() { return this.#name; }

  set name(name) {
    if (!Player.isValidName(name)) {
      throw new Error('Invalid player name: "' + name + '"');
    }
    this.#name = name;
  }

  toString() {
    return this.name + ' (' + this.color + ')';
  }
}