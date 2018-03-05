const CONSTANTS = {
  unitType: {
    PLAYER: 'PLAYER',
    CARD: 'CARD',
  },
  cardType: {
    MINION: 'MINION',
    SPELL: 'SPELL',
  },
  cardActions: {
    DAMAGE: 'DAMAGE',
    HEAL: 'HEAL',
    ADD_HEALTH: 'ADD_HEALTH',
    ADD_DAMAGE: 'ADD_DAMAGE',
    KILL: 'KILL',
  },
  playerActions: {
    DAMAGE: 'DAMAGE',
    HEAL: 'HEAL',
    DRAW: 'DRAW',
  },
  allowedEffects: ['BATTLECRY', 'DEATHRATTLE', 'PASSIVE'], // ACTIVE?
  allowedStates: ['TAUNT', 'POISONOUS', 'BLESSED', 'SLEEPING', 'WINDFURY', 'SILENCED'], // Blessed?
  // 'IMMUNE' === 'BLESSED' & 'GHOSTED'
}

class Spell {
  constructor(castOn) {
    //
  }
}

class CardCollection {
  constructor() {
    this.collection = {};
  }

  import(dbData) {}

  addCard(){
    const card = new Card(...arguments)
    if (this.search({ name: card.name }).length) {
      // warn
      return this.search({ name: card.name })[0]
    }
    return this.collection[card._id] = card
  }

  search() {
    return []
    // always return array
  }

  save() {
    // to DB
  }
}

class Card {
  constructor(mana = 0, cardType = CONSTANTS.cardType.MINION, name) {
    if (!name) {
      throw 'Card creation error: Name is a mandatory field'
    }
    this._id = Card.generateID()
    this.name = name
    this.mana = mana
    if (cardType in CONSTANTS.cardType) {
      this.type = cardType
    } else {
      // warn
      this.type = 'MINION'
    }
  }

  static generateID() {
    this._nextId = this._nextId || 1
    return this._nextId++
  }

  addSpell(spell = new Spell) {
    if (this.type !== CONSTANTS.cardType.SPELL) {
      // warn
      return this
    }
    if (spell instanceof Spell){
      this.spell = spell
    } else {
      // warn
      this.spell = new Spell
    }
    return this
  }

  setStats(attack = 0, health = 1) {
    if (this.type !== CONSTANTS.cardType.MINION) {
      // warn
      return this
    }
    this.attack = attack
    this.health = health
    return this
  }

  addEffects(effects = {}) {
    if (this.type !== CONSTANTS.cardType.MINION) {
      // warn
      return this
    }
    this.effects = this.effects || {}
    Object.keys(effects).forEach(effect => {
      if (CONSTANTS.allowedEffects.includes(effect.toUpperCase())) {
        if (effects[effect] instanceof Spell){
          this.effects[effect] = effects[effect]
        } else {
          // warn
        }
      }
    })
    return this
  }

  addStates(states = []) {
    if (this.type !== CONSTANTS.cardType.MINION) {
      // warn
      return this
    }
    this.states = this.states || {}
    states.forEach(state => {
      if (CONSTANTS.allowedStates.includes(state.toUpperCase())) {
        this.states[state] = 1
      }
    })
    return this
  }
}

class Game {
  constructor() {
    this.p1 = { playerId: 7, health: 50, mana: 1, board: [], hand: [], deck: [] }
    this.p2 = { playerId: 4, health: 30, mana: 3, board: [], hand: [], deck: [] }
  }

  playCard(){}

  attackCard(){}

  killCard(){}

  drawCards(){}

  activePassives(){}
}

class GameController {
  constructor(){
    // setup event handlers?
  }

  startGame(){}

  endTurn(){}

  endGame(){}
}
