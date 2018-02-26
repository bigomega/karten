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
  allowedEffects: ['BATTLECRY', 'DEATHRATTLE', 'ACTIVE', 'PASSIVE'],
  allowedStates: ['TAUNT', 'POISONOUS', 'GHOSTED', 'BLESSED', 'SLEEPING', 'SILENCED'],
  // 'IMMUNE' === 'BLESSED' & 'GHOSTED'
}

class Spell {
  constructor(castOn) {
/*
  == ON ==
  -1 ([ ANY / ALL / RANDOM ])
  -2 ([ CARD / PLAYER / UNIT ])
  | if -2 CARD
  |  -3 ([ SELF / ENEMY / BOTH ])
  |  -4 ([ BOARD / HAND / DECK ])

  == DO ==
  | if -2 CARD
  |  -a ([ KILL / CHANGE_HEALTH / CHANGE_ATTACK / STATE ])
  |  | if -a not KILL
  |  |  -b ([ SET / ADD / REMOVE ])
  |  |  | if -a STATE
  |  |  |  -c STATE_ID():fn
  |  |  | else
  |  |  |  -c COUNT():fn
  | else
  |  -a ([ CHANGE_HEALTH ])
  |  -b ([ ADD / REMOVE ])
  |  -c COUNT():fn

  == UNTIL ==
  | if -2 CARD & -a not KILL
  |  -I ([ END / BEGINNING ])
  |  -II ([ THIS_TURN / NEXT_TURN / PLAYER_NEXT_TURN / GAME ])

  // Compared to hearthstone, this does not cover
  // - [x] health/attack-modifying spells
  // - [x] state-modifying spells
  // - [ ] mana-modifying spells
  // - [ ] card-cost-modifying spells
  // - [ ] spell-damage-modifying spells
  // - [ ] Draw/Discard/Return-to-hand-deck/Copy/Transform/summon/evolve/ card spells
  // - [ ] discover/choose-one/Joust spells
  // - [ ] "if" condition for spells (also includes combo & if action while in hand)
  // - [ ] "when" condition for spells
  // - [ ] Differentiate between heal and add-health
  // - [ ] spell to set-health on hero

  // can have SET for non-card too but OP if ALL + UNIT + CHANGE_HEALTH + SET + COUNT(5)
  // rework when we have more than 2 players (ALL/RANDOM + PLAYER + ENEMY/BOTH)
*/

    //

    // if (castOn in CONSTANTS.unitType || 'BOTH') {
    //   this.castOn =
    // }
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
