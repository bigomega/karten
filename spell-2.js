// - Secret
// - Quest

// - AT
// - IF
// - DO (action)
// - ON (target)
// - Times
// - UNTIL
// - Result IF

var filters = ['_']
filters['card'] = [
  { _:'group', choices: GROUP_LIST, applicable: ['MINION'] },
  { _:'state', choices: STATE_LIST, applicable: ['MINION'] },
  { _:'effect', choices: EFFECT_LIST, applicable: ['MINION', 'WEAPON'] },
  { _:'tag', choices: TAG_LIST, applicable: ['MINION', 'WEAPON', 'SPELL'] },
]

filters['limit'] = [
  { _:'limit', choices: ['ALL', 'RANDOM', 'CHOSEN'] },
]

filters['in'] = [
  { _:'in', choices: ['BOARD', 'HAND', 'DECK'] },
]

filters['side'] = [
  { _:'side', choices: ['SELF', 'ENEMY', 'BOTH'] },
]

filters['cost'] = [
  { _:'cost', choices: ['SAME', 'RANDOM', '±<int:1-5>', '<int:0-10>'] },
  { _:'cost_type', choices: ['MANA', 'HEALTH'] },
]



Spell = {
  give: {},
  heal: {},
  damage: {},
  destroy: {},

  add: {},
  summon: {},
  transform: {},
  adapt: {},
  return: {},

  discover: {},

  draw: {},
  discard: {},
  cost: {},

  mana: {},

  choose: {},
}
