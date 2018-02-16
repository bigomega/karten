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
  allowedEffects: ['battlecry', 'deathrattle', 'active', 'passive'],
  allowedStates: ['taunt', 'poisonous', 'ghosted', 'blessed', 'silenced'],
}

class Spell {
  constructor(castOn) {
    // { ANY:1, ALL:1, RANDOM:1 }
    // { CARD:1, PLAYER:1, UNIT:1 }
    // { SELF:1, ENEMY:1, BOTH:1 }

    // "PLAYER" only allowed
    //   - ANY + PLAYER + BOTH
    //   - RANDOM + PLAYER + BOTH
    //   // rework when we have more than 2 players

    // if (castOn in CONSTANTS.unitType || 'BOTH') {
    //   this.castOn =
    // }
  }
}

class Card {
  constructor(mana = 0, cardType = CONSTANTS.cardType.MINION, name) {
    this.name = name
    this.mana = mana
    if (cardType in CONSTANTS.cardType) {
      this.type = cardType
    } else {
      // warn
      this.type = 'MINION'
    }
    return this
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
      if (CONSTANTS.allowedEffects.includes(effect)) {
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
      if (CONSTANTS.allowedStates.includes(state)) {
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
