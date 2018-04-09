Number.prototype[Symbol.iterator] = function* () {
  for (i=0; i<this; i++) {
    yield i
  }
}

Object.prototype[Symbol.iterator] = function* () {
  const keyArray = Object.keys(this)
  for (i=0; i<keyArray.length; i++) {
    const key = keyArray[i]
    // this[key].__key = key
    yield this[key]
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

  search({ id, name, mana, tags }) {
    if (id) {
      const card = this.collection[id]
      return card ? [card] : []
    }
    if (name) {
      return [...this.collection].reduce((mem, card) =>
        card.name.toLowerCase().includes(name.toLowerCase()) ? mem.concat([card]) : mem
      , [])
    }
    return []
    // always return array
  }

  generatDeck(cardIds = []){
    return []
      .concat(...cardIds.map(cid => this.search({ id: cid })))
      .map(card => card.duplicate())
    ;
  }

  save() {
    // to DB
  }
}

class Card {
  constructor({ mana = 0, cardType = CONSTANTS.cardType.MINION, name, stat = [], states = [], tags = [] }) {
    if (!name) {
      throw 'Card creation error: Name is a mandatory field'
    }
    if (cardType in CONSTANTS.cardType) {
      this.type = cardType
    } else {
      // warn
      this.type = 'MINION'
    }

    this.id = Card.generateID()
    this.name = name
    this.tags = tags
    this.default = { mana }
    this.buffs = []
    this.setOriginalStat(...stat)
    this.setOriginalStates(states)
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

  setOriginalStat(attack = 0, health = 1) {
    if (this.type !== CONSTANTS.cardType.MINION) {
      // warn
      return this
    }
    this.default.attack = attack
    this.default.health = health
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

  setOriginalStates(states = []) {
    if (this.type !== CONSTANTS.cardType.MINION) {
      // warn
      return this
    }
    this.default.states = {}
    states.forEach(state => {
      if (CONSTANTS.allowedStates.includes(state.toUpperCase())) {
        this.default.states[state] = 1
      }
    })
    return this
  }

  duplicate() {
    return JSON.parse(JSON.stringify(this))
  }
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

  lastCard(){
    return this.cards[this.cards.length - 1]
  }

  pop(){
    return this.cards.pop()
  }

  removeCards(){}
}

class User {
  constructor({ catalog = [], deckList = [[]], rank = 25, gold = 100, stats = {}, username, pass } = {}){
    if (!username || !pass) { throw `Need a username and password` }
    this.id = User.generateID()
    this.deckList = deckList
    this.name = name
  }

  getDeck(deckIndex) {
    // Todo throw error
    return this.deckList[deckIndex] || []
  }

  static generateID() {
    this._nextId = this._nextId || 1
    return this._nextId++
  }
}

// Player is just a game state. user makes the actions, player stat gets changed
class Player {
  constructor({ user, deck = new Deck, health = 30, mana = 0, manaPool = 0, hand = [], shuffle = true } = {}){
    this._user = user
    this.id = user.id
    this.health = health
    this.mana = mana
    this.manaPool = manaPool
    this.hand = hand
    this.deck = deck

    shuffle && this.deck.shuffle()
  }

  drawCards(n = 1) {
    ;[...n].map(i => this.hand.push(this.deck.pop()))
  }
}

class Board {
  constructor({ playerCount = 2, players = [] }) {
    this.sides = {}
    ;[...playerCount].map(i => {
      this.sides[players[i].id] = { player: players[i], board: [] }
    })
  }
}

class Game {
  constructor({ players = [] } = {}) {
    if (players.length < 2) { throw `There must be at least 2 players for a game` }
    this.players = {}

    players.map(({ user, deck }) => {
      if (!user || !(user instanceof User)) {
        throw `Please provide the user for this player`
      }
      if (!deck || !(deck instanceof Deck)) {
        throw `Please provide a deck for this player`
      }

      this.players[user.id] = new Player({
        user: user,
        deck: deck,
      })
      user._currentGame = this
    })

    this.board = new Board({ players: [...this.players] })

    this._state = {
      current_turn: 1,
      current_player: [...this.players][0],
      current_player_index: 0,
      player_id_array: [...this.players].map(p => p.id),
    }
    this.newTurnInit()
  }

  do(){}

  newTurnInit() {
    this.giveManaPool({ player: this._state.current_player, mana: 1 })
    this.giveMana({ player: this._state.current_player, mana: Infinity })
  }

  giveMana({ player, mana = 1 } = {}) {
    if (isFinite(mana)) {
      player.mana = mana
    } else {
      // fill the pool
      player.mana = player.manaPool
    }
  }

  giveManaPool({ player, mana = 1 } = {}) {
    player.manaPool += 1
  }

  userPlayCard(uId, cardIndex){
    // if (!this.players[uId]) { throw `User not a part of the game.` } // redundant
    if (uId !== this._state.current_player.id) { throw `Not this user's turn to play` }
    const card = this._state.current_player.hand.splice(cardIndex, 1)
    // todo: need to improve positioning, need to add events
    this.board.sides[uId].board.push(card.pop()) // or [0]
  }

  userCardAttack(uId, boardIndex, { self = false, targetIndex = -1 }){
    // index for any card in the board, -1 for hero
    if (uId !== this._state.current_player.id) { throw `Not this user's turn to play` }
    // TK need to put this ^ in a common place
    if (boardIndex >= this.board.sides[uId].board.length) { throw `<fnName>: Card position not found` }
    if (targetIndex === -1) {
      // if ()
      // TODO rewrite for TWO PLAYER ONLY
    }
  }

  userEndTurn(uId) {
    if (this._checkGameEnd()) {
      return console.log('game has ended')
    }
    if (uId !== this._state.current_player.id) { throw `Not this user's turn to play` }
    // TK shame. shame. shame.
    this._state.current_turn += 1
    this._state.current_player_index += 1
    this._state.current_player_index = this._state.current_player_index >= this._state.player_id_array.length ? 0 : this._state.current_player_index
    this._state.current_player = this.players[this._state.player_id_array[this._state.current_player_index]]
  }

  _checkGameEnd() {
    // warn: will fail for negative health
    return !([...this.players].reduce((mem,p) => mem * p.health, 1))
  }

  render(){
    const players = [...this.players]
    console.log(`p1: id(${players[0].id}), p2: id(${players[1].id})`)
    console.log('p1 - topdeck: ', players[0].deck.lastCard())
    console.log('p1 - hand: ', players[0].hand.map(c => c.id))
    console.log('p1 - board: ', this.board.sides[players[0].id].board.map(c => c.id))
    console.log('p2 - board: ', this.board.sides[players[1].id].board.map(c => c.id))
    console.log('p2 - hand: ', players[1].hand.map(c => c.id))
    console.log('p2 - topdeck: ', players[1].deck.lastCard())
    console.log([...20].map(i => '-').join(''))
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

// === Classes ===

// Spell
// Card
// CardCollection
// User

// there are 2 "deck", one in-game and one is just a card-id list outside game
// <> in game
// Deck
// Player
// Board
// Game

var catalog = new CardCollection()
catalog.addCard({
  mana: 1,
  cardType: 'MINION',
  name: 'Sword',
  stat: [2,1],
  states: ['charge'],
})
catalog.addCard({
  mana: 1,
  cardType: 'MINION',
  name: 'Shield',
  stat: [1,3],
  states: ['taunt'],
})

var u1 = new User({ username: 'foo', pass: 'pass' })
var u2 = new User({ username: 'bar', pass: 'pass' })

;[...15].map(i => {
  var c1 = catalog.search({ name: 'Sword' })[0]
  var c2 = catalog.search({ name: 'Shield' })[0]
  u1.deckList[0].push(c1.id, c2.id)
  u2.deckList[0].push(c1.id, c2.id)
})

// picked by user
var deckIndex = 0

var game = new Game({
  players: [
    { user: u1, deck: new Deck(catalog.generatDeck(u1.getDeck(deckIndex))), playerConfig: {} },
    { user: u2, deck: new Deck(catalog.generatDeck(u2.getDeck(deckIndex))), playerConfig: {} },
  ]
})

;[...game.players][0].drawCards(3)
;[...game.players][1].drawCards(3)

game.render()
game.userPlayCard(u1.id, 0)
game.userCardAttack(u1.id, 0, { targetIndex: -1 })
game.userEndTurn(u1.id)
game.render()
