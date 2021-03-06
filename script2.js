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

// utils
class LimitedArray extends Array {
  constructor() {
    super(...arguments)
    this.limit = 50
  }

  setLimit(limit = 50) {
    this.limit = limit
    this.push() // to remove extras
    return this
  }

  push() {
    if (this.length + arguments.length <= this.limit) {
      return Array.prototype.push.call(this, ...arguments)
    } else {
      ;[...(this.length - this.limit)].map(i => this.pop())
      console.warn(`LimitedArray: Pushing beyond limit. Ignored`)
      return this.length
    }
  }

  splice(start, deleteCount, ...args) {
    if ((this.length + args.length - deleteCount) <= this.limit) {
      return Array.prototype.splice.call(this, start, deleteCount, ...args)
    } else {
      ;[...(this.length - this.limit)].map(i => this.pop())
      console.warn(`LimitedArray: Splicing beyond limit. Ignored`)
      return []
    }
  }

  isFull() {
    return this.length >= this.limit
  }
}

const CONSTANTS = {
  GLOBAL_LIMIT: {
    PLAYERS: 2,
    BOARD: 7,
    HAND: 10,
    DECK: 30,
    MANAPOOL_LIMIT: 10,
    USER_DECK_SAME_CARD: Infinity,
  },
  GAME_DEFAULTS: {
    STARTING_HAND: 3,
    PLAYER_STARTING_HEALTH: 30,
    PLAYER_STARTING_MANA: 0,
    TURN_START_CARD_DRAW: 1,
    TURN_START_MANAPOOL_GAIN: 1,
  },
  cardType: {
    MINION: 'MINION',
    SPELL: 'SPELL',
  },
  allowedEffects: ['BATTLECRY', 'DEATHRATTLE'],
  allowedStates: ['TAUNT', 'POISONOUS', 'BLESSED', 'WINDFURY', 'STEALTH', 'CHARGE'],
}
CONSTANTS.states = CONSTANTS.allowedStates.reduce((mem, s) => (mem[s] = s, mem), {})

class SpellAction {
  constructor(castOn) {
    //
  }
}

class CardCollection extends Array {
  constructor(...args) {
    super(...args)
  }

  addMinion({ ...args }){
    if (!args.name){ throw `addMinion: Name not provided` }
    if (this.search({ name: args.name }).length) {
      console.warn(`addMinion: The name "${args.name}" already exists`)
      return this.search({ name: args.name })
    }
    return this[this.length] = new Minion({ _id: this.length, ...args })
  }

  search({ id, name, mana, tags }) {
    if (id) {
      return this[id] ? [this[id]] : []
    }
    if (name) {
      return this.filter(card =>
        card.name.toLowerCase().includes(name.toLowerCase())
      )
    }
    // always returns array
    return []
  }

  generatDeck(cardIds = []){
    return cardIds
      .map(cid => this[cid])
      .filter(card => card !== undefined)
      .map(card => card.clone())
    ;
  }
}

class Card {
  constructor({ _id, mana = 0, name, tags = [] } = {}) {
    if (!name) {
      throw 'Card creation error: Name is a mandatory field'
    }

    this.id = _id || Card.generateID()
    this.name = name
    this.tags = tags
    this.default = this.current = { mana }
  }

  static generateID() {
    this._nextId = this._nextId || 10000
    return this._nextId++
  }

  onPlay({ turn }) {}

  onTurnStart(turn) {}

  clone(obj = this) {
    // todo: Will likely fail when spells and battlecry are implemented (self-reference possibility)
    const clone = Object.create(obj)
    for(var i in obj) {
      if(obj[i] != null && typeof(obj[i])=="object")
        clone[i] = this.clone(obj[i])
      else
        clone[i] = obj[i]
    }
    return clone
  }
}

class Minion extends Card {
  constructor(...args) {
    super(...args)
    const { attack = 0, health = 1, states = [] } = args[0]
    this.buffs = []

    this.default = this.current = {
      ...this.default,
      attack: attack,
      health: health,
      states: {},
    }
    states.forEach(state => {
      if (CONSTANTS.allowedStates.includes(state.toUpperCase())) {
        this.default.states[state] = this.current.states[state] = 1
      }
    })
  }

  onPlay({ turn }) {
    this.turnPlayed = turn
    if (!this.current.states[CONSTANTS.states.CHARGE]) {
      this.sleeping = true
    }
    this.hasAttackedThisTurn = 0
  }

  onTurnStart(turn) {
    this.hasAttackedThisTurn = 0
    this.sleeping = false
  }

  damage(value) {
    this.current.health -= value
    if (this.current.health <= 0) {
      return { dead: 1 }
    }
    return this.current.health
    // TK make this event based (send an event and game/board must be listening)
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
}

class Spell extends Card {
  constructor(...args) {
    super(...args)
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
    if (!this.deckList[deckIndex]) { throw `deckIndex not found for user` }
    return this.deckList[deckIndex]
  }

  static generateID() {
    this._nextId = this._nextId || 1
    return this._nextId++
  }
}

class Hand extends LimitedArray {
  constructor() {
    super(...arguments)
    this.setLimit(CONSTANTS.GLOBAL_LIMIT.HAND)
    return this
  }

  add(card) {
    if (!(card && card instanceof Card)) {
      throw `only have cards can be added to Hand`
    }
    this.push(card)
    return this
  }

  remove(cardIndex) {
    return this.splice(cardIndex, 1)
  }
}

// Player is just a game state. user makes the actions, player stat gets changed
class Player {
  constructor({ user, deck = new Deck, health = CONSTANTS.GAME_DEFAULTS.PLAYER_STARTING_HEALTH, manaPool = CONSTANTS.GAME_DEFAULTS.PLAYER_STARTING_MANA, hand = [], shuffle = true } = {}){
    this._user = user
    this.id = user.id
    this.health = health
    this.manaPool = this.mana = manaPool
    this.hand = new Hand(...hand)
    this.deck = deck

    shuffle && this.deck.shuffle()
  }

  damage(value) {
    this.health -= value
    if (this.health <= 0) {
      return { lost: 1 }
    }
    return this.health
  }

  giveMana(mana = 1) {
    this.setMana(this.mana + mana)
  }

  setMana(mana = 1) {
    if (isFinite(mana)) {
      this.mana = mana
    } else {
      // fill the pool
      this.mana = this.manaPool
    }
  }

  giveManaPool(mana = 1) {
    if (this.manaPool + mana > CONSTANTS.GAME_DEFAULTS.MANAPOOL_LIMIT) {
      this.manaPool += CONSTANTS.GAME_DEFAULTS.MANAPOOL_LIMIT
    } else {
      this.manaPool += mana
    }
  }

  drawCards(n = 1) {
    ;[...n].map(i => this.hand.add(this.deck.pop()))
  }
}

class Board extends LimitedArray {
  constructor() {
    super(...arguments)
    this.setLimit(CONSTANTS.GLOBAL_LIMIT.BOARD)
    return this
  }

  add(boardIndex, minion) {
    if (!(minion && minion instanceof Minion)) {
      throw `only minions can be added to Board`
    }
    this.splice(boardIndex, 0, minion)
    return this
  }

  remove(boardIndex) {
    return this.splice(boardIndex, 1)
  }
}

class Game {
  constructor({ players = [] } = {}) {
    if (players.length < 2) { throw `There must be at least 2 players for a game` }
    this.players = {}
    this.boards = {}

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

      this.boards[user.id] = new Board()
    })


    this.state = {
      current_turn: 1,
      current_player: [...this.players][0],
    }
    this.state.current_player.drawCards(CONSTANTS.GAME_DEFAULTS.STARTING_HAND)
    this._getOpponent().drawCards(CONSTANTS.GAME_DEFAULTS.STARTING_HAND + 1)
    this.newTurnInit()
  }

  newTurnInit() {
    this.state.current_player.drawCards(CONSTANTS.GAME_DEFAULTS.TURN_START_CARD_DRAW)
    this.state.current_player.giveManaPool(CONSTANTS.GAME_DEFAULTS.TURN_START_MANAPOOL_GAIN)
    this.state.current_player.setMana(Infinity)
    this._getBoard().map(c => c.onTurnStart())
  }

  userCanPlayCard(player, card) {
    if (card.current.mana > player.mana) { throw `userCanPlayCard: Not enough mana <NOT_ENOUGH_MANA>` }
    if (card && card instanceof Minion) {
      if (this._getBoard({ player }).isFull()) { throw `userCanPlayCard: No space in board` }
    }
  }

  userPlayCard(pId, cardIndex, boardPosition = 0){
    this._checkIfPlayerTurn({ pId })
    const player = this._getPlayer({ pId })
    if (cardIndex >= player.hand.length) {
      throw `userPlayCard: Card index not found in hand`
    }
    // TK need to add events
    const card = player.hand[cardIndex]
    this.userCanPlayCard(player, card)
    if (card instanceof Minion) {
      const board = this._getBoard({ pId })
      const boardIndex = boardPosition > board.length ? board.length : boardPosition
      player.hand.remove(cardIndex)
      card.onPlay({ turn: this.state.current_turn, position: boardIndex })
      board.add(boardIndex, card)
      player.mana -= 1
    }
    console.log('== userPlayCard')
    this.render()
  }

  userMinionAttack(pId, boardIndex, targetIndex = -1){
    // index for any card in the board, -1 for hero
    this._checkIfPlayerTurn({ pId })
    const minion = this._getBoardMinion({ pId, boardIndex })
    if (minion.current.attack < 1) { throw `userMinionAttack: Can't attack, no damage minion <ZERO_ATTACK_MINION>` }
    if (minion.sleeping) {
      throw `userMinionAttack: minion played this turn can't attack <MINION_SLEEPING>`
    }
    if (minion.hasAttackedThisTurn) {
      throw `This minion has already attacked this turn`
    }
    const enemyBoard = this._getBoard({ pId, isOpponent: true })
    // TK "when minion attacks" action/secret
    const tauntIndices = enemyBoard.findIndices(c => c.current.states[CONSTANTS.states.TAUNT])
    if (tauntIndices.length && !tauntIndices.includes(targetIndex)) {
      throw `userMinionAttack: Can't attack past taunts (at ${tauntIndices}) <TAUNT_IN_WAY>`
    }
    if (targetIndex < 0) {
      if (this._getOpponent({ pId }).damage(minion.current.attack).dead) {
        throw `Game ended: (${pId}) WON <GAME_ENDED:${pId}>`
      }
    } else {
      const targetMinion = this._getBoardMinion({ board: enemyBoard, boardIndex: targetIndex })
      targetMinion.damage(minion.current.attack).dead && this._killMinion({ pId, boardIndex: targetIndex, isOpponent: true })
      minion.damage(targetMinion.current.attack).dead && this._killMinion({ pId, boardIndex })
    }
    minion.hasAttackedThisTurn += 1
    console.log('== userMinionAttack')
    this.render()
  }

  userEndTurn(pId) {
    this._checkIfPlayerTurn({ pId })
    this.state.current_turn += 1
    this.state.current_player = this._getOpponent()
    this.newTurnInit()
  }

  _getPlayer({ pId, player = this.state.current_player, isOpponent = false } = {}) {
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

  _getBoard({ pId, ...args } = {}) {
    const id = (!args.isOpponent && pId) || this._getPlayer({ ...args }).id
    if (!this.boards[id]) { throw `_getBoard: Board not found. Something went wrong. args: ${JSON.stringify(args)}` }
    return this.boards[id]
  }
  _getBoardMinion({ boardIndex = 0, board, ...args } = {}) {
    const minion = (board || this._getBoard({...args}))[boardIndex]
    if (!(minion && minion instanceof Minion)) {
      throw `_getBoardMinion: Minion not found`
    }
    return minion
  }

  _killMinion({ ...args }) {
    const minion = this._getBoard({ ...args }).remove(args.boardIndex)
  }

  _checkIfPlayerTurn({ pId, player = {} } = {}) {
    // if (!this.players[(pId || player.id)]) { throw `User not a part of the game.` } // redundant
    if ((pId || player.id) !== this.state.current_player.id) { throw `Not this user's turn to play <NOT_PLAYER_TURN>` }
    return true
  }

  render(){
    const [p1, p2] = [...this.players]
    console.log([...20].map(i => '-').join(''))
    console.log(`p${this.state.current_player.id} turn to play`)
    console.log([...20].map(i => '-').join(''))
    console.log(`p1 - health: ${p1.health}, mana: ${p1.mana}/${p1.manaPool}`, ', hand:', Array(...p1.hand).map(c => c.name))
    console.log('board: ', Array(...this._getBoard({ player: p1 }))
      .map(c => `${c.current.attack} -${Object.keys(c.current.states)}- ${c.current.health} (${c.name})`)
    )
    console.log('board: ', Array(...this._getBoard({ player: p2 }))
      .map(c => `${c.current.attack} -${Object.keys(c.current.states)}- ${c.current.health} (${c.name})`)
    )
    console.log(`p2 - health: ${p2.health}, mana: ${p2.mana}/${p2.manaPool}`, ', hand:', Array(...p2.hand).map(c => c.name))
  }
}

class GameController {
  constructor(){
    // TK setup event handlers?
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
catalog.addMinion({
  mana: 1,
  name: 'Sword',
  attack: 1,
  health: 3,
})
catalog.addMinion({
  mana: 1,
  name: 'Shield',
  attack: 0,
  health: 5,
  states: [CONSTANTS.states.TAUNT],
})
catalog.addMinion({
  mana: 1,
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


// for ease of use only
const p1 = {}
const p2 = {}
try {
  var game = new Game({
    players: [
      { user: u1, deck: new Deck(catalog.generatDeck(u1.getDeck(deckIndex))), playerConfig: {} },
      { user: u2, deck: new Deck(catalog.generatDeck(u2.getDeck(deckIndex))), playerConfig: {} },
    ]
  })
  console.log('p1:',u1.id, '  p2:', u2.id)
  console.log('Avilable functions: p1.[play, attack, endTurn] (same for p2)')
  game.render()

  p1.play = (...args) => game.userPlayCard(u1.id, ...args)
  p1.attack = (...args) => game.userMinionAttack(u1.id, ...args)
  p1.endTurn = x => game.userEndTurn(u1.id)

  p2.play = (...args) => game.userPlayCard(u2.id, ...args)
  p2.attack = (...args) => game.userMinionAttack(u2.id, ...args)
  p2.endTurn = x => game.userEndTurn(u2.id)
} catch(e) {
  if (! /\<[a-zA-Z0-9_:]+\>$/.test(e)) {
    throw e
  }
  console.log(e)
}
