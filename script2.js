Number.prototype[Symbol.iterator] = function* () {
  for (i=0; i<this; i++) {
    yield i
  }
}

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
  allowedEffects: ['BATTLECRY', 'DEATHRATTLE'],
  allowedStates: ['TAUNT', 'POISONOUS', 'BLESSED', 'WINDFURY', 'STEALTH', 'CHARGE'],
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
    return this.collection[card.id] = card
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
    this.id = Card.generateID()
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

  // addEffects(effects = {}) {
  //   if (this.type !== CONSTANTS.cardType.MINION) {
  //     // warn
  //     return this
  //   }
  //   this._effects = this._effects || {}
  //   Object.keys(effects).forEach(effect => {
  //     if (CONSTANTS.allowedEffects.includes(effect.toUpperCase())) {
  //       if (effects[effect] instanceof Spell){
  //         this._effects[effect] = effects[effect]
  //       } else {
  //         // warn
  //       }
  //     }
  //   })
  //   return this
  // }

  addStates(states = []) {
    if (this.type !== CONSTANTS.cardType.MINION) {
      // warn
      return this
    }
    this._states = this._states || {}
    states.forEach(state => {
      if (CONSTANTS.allowedStates.includes(state.toUpperCase())) {
        this._states[state] = 1
      }
    })
    return this
  }
}

class Tracker {
  constructor(){}
}

class Deck {
  constructor(cards = []){
    this.cards = cards
  }

  shuffle(){
    // https://bost.ocks.org/mike/shuffle/
    let last = this.cards.length, temp, i
    while (last) {
      i = Math.floor(Math.random() * last--)
      temp = this.cards[last]
      this.cards[last] = this.cards[i]
      this.cards[i] = temp
    }
    return this
  }

  addCards(){
    Array.from(arguments).map(cid => this.cards.push(cid))
  }

  lastCard(){
    return this.cards[this.cards.length - 1]
  }

  pop(){
    return this.cards.pop()
  }

  removeCards(){}
}

class Player {
  constructor({ deck = new Deck, health = 30, mana = 1, board = [], hand = [] } = {}){
    this.id = Player.generateID()
    this.deck = deck
    this.health = health
    this.mana = mana
    this.board = board
    this.hand = hand
    this.deck = deck
  }

  static generateID() {
    this._nextId = this._nextId || 1
    return this._nextId++
  }

  drawCards(n = 1) {
    ;[...n].map(i => this.hand.push(this.deck.pop()))
  }
}

class Game {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
    this._state = {
      current_turn: 1,
      current_player: 1,
    }
  }

  playCard(){}

  attackCard(){}

  render(){
    console.log('p1 - topdeck: ', this.p1.deck.lastCard())
    console.log('p1 - hand: ', this.p1.hand)
    console.log('p1 - board: ', this.p1.board)
    console.log('p2 - board: ', this.p2.board)
    console.log('p2 - hand: ', this.p2.hand)
    console.log('p2 - topdeck: ', this.p2.deck.lastCard())
  }
}

class GameController {
  constructor(){
    // setup event handlers?
  }

  startGame(){}

  endTurn(){}

  endGame(){}
}


var catalog = new CardCollection()
var c1 = catalog.addCard(1, 'MINION', 'Sword')
  .setStats(2,1)
  .addStates(['CHARGE'])
;
var c2 = catalog.addCard(1, 'MINION', 'Shield')
  .setStats(1,3)
  .addStates(['taunt'])
;

var p1 = new Player()
var p2 = new Player()

;[...15].map(i => {
  p1.deck.addCards(c1.id, c2.id)
  p2.deck.addCards(c1.id, c2.id)
})

p1.deck.shuffle()
p2.deck.shuffle()

var game = new Game(p1, p2)
p1.drawCards(3)
p2.drawCards(3)
game.render()
