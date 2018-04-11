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

Array.prototype.findIndexes = Array.prototype.findIndices = function findIndexes() {
  const callback = arguments[0]
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`)
  }
  return this.reduce((mem, val, i) => callback(val, i) ? mem.concat([i]) : mem, [])
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
CONSTANTS.states = CONSTANTS.allowedStates.reduce((mem, s) => (mem[s] = s, mem), {})

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
      return [...this.collection].filter(card =>
        card.name.toLowerCase().includes(name.toLowerCase())
      )
    }
    // always returns array
    return []
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
  constructor({ mana = 0, cardType = CONSTANTS.cardType.MINION, name, attack = 0, health = 1, states = [], tags = [] } = {}) {
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
    this.default = this.current = { mana }
    this.buffs = []

    if (this.type === CONSTANTS.cardType.MINION) {
      this.default = this.current = {
        ...this.default,
        attack: attack,
        health: health,
      }
      this.default.states = this.current.states = {}
      states.forEach(state => {
        if (CONSTANTS.allowedStates.includes(state.toUpperCase())) {
          this.default.states[state] = this.current.states[state] = 1
        }
      })
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

  setOriginalStates(states = []) {
    if (this.type !== CONSTANTS.cardType.MINION) {
      // warn
      return this
    }
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

  duplicate() {
    // TODO: FIX THIS (THIS TAKES AWAY THE OBEJECT INSTANCE TYPE)
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

  damage(value) {
    this.health -= value
    // todo: catch this outside
    if (this.health <= 0) {
      throw `Game ended: (${this.id}) WON <GAME_ENDED:${this.id}>`
    }
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

    this.state = {
      current_turn: 1,
      current_player: [...this.players][0],
    }
    this.newTurnInit()
  }

  do(){}

  newTurnInit() {
    this.giveManaPool({ player: this.state.current_player, mana: 1 })
    this.giveMana({ player: this.state.current_player, mana: Infinity })
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

  userPlayCard(pId, cardIndex){
    this._checkIfPlayerTurn({ pId })
    const player = this._getPlayer({ pId })
    if (cardIndex >= player.hand.length) {
      throw `userPlayCard: Card index not found in hand`
    }
    // todo: check can play (also check and allow only at turn start)
    // todo: need to give positioning options, limit size, need to add events
    const card = player.hand[cardIndex]
    if (card.current.mana > player.mana) { throw `userPlayCard: Not enough mana <NOT_ENOUGH_MANA>` }
    if (card.type === CONSTANTS.cardType.MINION) {
      // todo: write a function to add and remove
      player.hand.splice(cardIndex, 1)
      card.turnPlayed = this.state.current_turn
      // todo: write a function to add
      this._getBoard({ pId }).push(card)
      player.mana -= 1
    }
  }

  userMinionAttack(pId, boardIndex, { isOpponent = true, targetIndex = -1 }){
    // index for any card in the board, -1 for hero
    this._checkIfPlayerTurn({ pId })
    const minion = this._getBoardMinion({ pId, boardIndex })
    if (minion.current.attack < 1) { throw `userMinionAttack: Can't attack, no damage <MINION_ZERO_ATTACK>` }
    if (minion.turnPlayed === this.state.current_turn && !minion.current.states[CONSTANTS.states.CHARGE]) {
      throw `userMinionAttack: minion played this turn can't attack <MINION_SLEEPING>`
    }
    const enemyBoard = this._getBoard({ pId, isOpponent: true })
    // todo: "when minion attacks" action/secret
    const tauntIndices = enemyBoard.findIndices(c => c.current.states[CONSTANTS.states.TAUNT])
    if (tauntIndices.length && !tauntIndices.includes(targetIndex)) {
      // todo: catch this outside
      throw `userMinionAttack: Can't attack past taunts (at ${tauntIndices}) <TAUNT_IN_WAY>`
    }
    if (targetIndex < 0) {
      this._getPlayer({ pId, isOpponent: true }).damage(minion.current.attack)
    } else {
      const targetMinion = this._getBoardMinion({ board: enemyBoard, boardIndex: targetIndex })
      targetMinion.current.health -= minion.current.attack
      minion.current.health -= targetMinion.current.attack
      // todo: write functions for reduce health
      minion.current.health <= 0 && this._killMinion({ pId, boardIndex })
      targetMinion.current.health <= 0 && this._killMinion({ pId, boardIndex: targetIndex, isOpponent: true })
    }
  }

  userEndTurn(uId) {
    this.state.current_turn += 1
    this.state.current_player = this._getPlayer({ player: this.state.current_player, isOpponent: true })
    this.newTurnInit()
  }

  _getPlayer({ pId, player, isOpponent = false } = {}) {
    if (!pId && !(player && player instanceof Player)) {
      throw `Need player Id or the player object instance`
    }
    let id = pId || player.id
    if (isOpponent) {
      id = Object.keys(this.players).filter(k => k != (pId || player.id))[0]
    }
    if (!this.players[id]) { throw `Player ${id} doesn't exist in game` }
    return this.players[id]
  }
  _getOpponent({ isOpponent, ...args } = {}) { return this._getPlayer({ isOpponent: true, ...args }) }

  _getBoard(...args) {
    const id = this._getPlayer(...args).id
    // todo: common logger fn with args and more
    if (!this.board.sides[id]) { throw `_getBoard: Board not found. Something went wrong. args: ${JSON.stringify(args)}` }
    return this.board.sides[id].board
  }
  _getBoardMinion({ boardIndex = 0, board, ...args } = {}) {
    const minion = (board || this._getBoard({...args}))[boardIndex]
    // todo: maybe think about inherting card into spells and minions
    // TODO: enable after duplicate fix
    // if (!(minion && minion instanceof Card && minion.type !== CONSTANTS.cardType.MINION)) {
    //   throw `_getBoardMinion: Minion not found`
    // }
    return minion
  }

  _killMinion({ ...args }) {
    // const minion = this._getBoardMinion({ ...args })
    this._getBoard({ ...args }).splice(args.boardIndex, 1)
  }

  _checkIfPlayerTurn({ pId, player = {} } = {}) {
    // todo: turn this into a decorator
    // if (!this.players[(pId || player.id)]) { throw `User not a part of the game.` } // redundant
    if ((pId || player.id) !== this.state.current_player.id) { throw `Not this user's turn to play <NOT_PLAYER_TURN>` }
    return true
  }

  render(){
    const players = [...this.players]
    console.log(`p1: id(${players[0].id}), p2: id(${players[1].id})`)
    console.log('p1 - topdeck: ', players[0].deck.lastCard())
    console.log(`p1 - mana: ${players[0].mana}/${players[0].manaPool}`)
    console.log('p1 - hand: ', players[0].hand.map(c => c.id))
    console.log('p1 - board: ', this.board.sides[players[0].id].board.map(c => c.id))
    console.log('p2 - board: ', this.board.sides[players[1].id].board.map(c => c.id))
    console.log('p2 - hand: ', players[1].hand.map(c => c.id))
    console.log(`p2 - mana: ${players[1].mana}/${players[1].manaPool}`)
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
  attack: 1,
  health: 3,
})
catalog.addCard({
  mana: 1,
  cardType: 'MINION',
  name: 'Shield',
  attack: 0,
  health: 5,
  states: [CONSTANTS.states.TAUNT],
})
catalog.addCard({
  mana: 1,
  cardType: 'MINION',
  name: 'Arrow',
  attack: 2,
  health: 1,
  states: [CONSTANTS.states.CHARGE],
})

var u1 = new User({ username: 'foo', pass: 'pass' })
var u2 = new User({ username: 'bar', pass: 'pass' })

;[...10].map(i => {
  var c1 = catalog.search({ name: 'Sword' })[0]
  var c2 = catalog.search({ name: 'Shield' }).pop()
  var c3 = catalog.search({ name: 'Arrow' })[0]
  u1.deckList[0].push(c1.id, c2.id, c3.id)
  u2.deckList[0].push(c1.id, c2.id, c3.id)
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

try {
  game.render()
  game.userPlayCard(u1.id, 0)
  // game.userPlayCard(u1.id, 0)
  // game.userPlayCard(u1.id, 0)
  game.userMinionAttack(u1.id, 0, { targetIndex: -1 })
  game.userEndTurn(u1.id)

  game.userPlayCard(u2.id, 0)
  game.render()

  game.userMinionAttack(u2.id, 0, { targetIndex: 0 })
  game.userEndTurn(u2.id)
  game.render()
} catch(e) {
  if (! /\<[a-zA-Z0-9_:]+\>$/.test(e)) {
    throw e
  }
  console.log(e)
}
