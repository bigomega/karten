// - on Minion in game
// - on Cards non-game
// - on Weapon
// - on Hero
// - other
//   - Other Cost-change
//   - Draw
//   - Mana

// - Secret
// - Quest

// - IF
// - Times
// - AT
// - UNTIL
// - Result IF


Target('MINION')
  .in('BOARD') // HAND / DECK / SELF
  .side('MINE') // ENEMY / BOTH / EITHER (random)
  .limit('CHOSEN') // ALL / RANDOM / EDGE
  .of({ GROUP: 'ANY', STATE: 'ANY', EFFECT: 'ANY', TAG: 'ANY' })


filters = ['_']
filters[1] = [
  { _:'group', choices: GROUP_LIST, applicable: ['MINION'] },
  { _:'state', choices: STATE_LIST, applicable: ['MINION'] },
  { _:'effect', choices: EFFECT_LIST, applicable: ['MINION', 'WEAPON'] },
  { _:'tag', choices: TAG_LIST, applicable: ['MINION', 'WEAPON', 'SPELL'] },
]

filters[2] = [
  { _:'limit', choices: ['ALL', 'RANDOM', 'CHOSEN'] },
]

filters[3] = [
  { _:'in', choices: ['BOARD', 'HAND', 'DECK'] },
]

filters[4] = [
  { _:'side', choices: ['SELF', 'ENEMY', 'BOTH'] },
]

filters[5] = [
  { _:'cost', choices: ['SAME', 'RANDOM', '±<int:1-5>', '<int:0-10>'] },
  { _:'cost_type', choices: ['MANA', 'HEALTH'] },
]

values = {}
values['stat'] = {
  set: { x: '<int:0-100>', y: '<int:0-100>' },
  change: { x: '±<int:0-100>', y: '±<int:0-100>' },
}


var target = {
  MINION: {
    in_play: { _applyFilters: [3, 4] },
    from_history: [
      { _:'played_by', choices: ['YOU', 'ENEMT', 'BOTH'] },
      { _:'died_side', choices: ['YOU', 'ENEMT', 'BOTH'] },
    ],
    last_played: '<int:0-Inf>',
    _applyFilters: [1, 2]
  },

  WEAPON: { _applyFilters: [2, 3, 4] },
}

var Action = {
  MINION: {
    give: {
      stats: {
        from_when_condition: 0,
        _getValues: ['stat'],
      },
      state: STATE_LIST,
      effect: { DEATHRATTLE: 'new Spell' }
    },
    transform: {
      specific: '<CARD_ID>',
      random: { _applyFilters: [1, 5] }
      _onlyIf: { target: { in: 'BOARD' } },
    },
    add: [
      { _:'to' choices: ['HAND', 'DECK'] },
      { _applyFilters: [4, 5] },
    ],
    summon: [
      {
        _:'with_stat',
        choices: {
          SAME: {},
          CHANGED: { _getValues: ['stat'] }
        }
      },
      { _:'with_buffs', choices: [true, false] },
      { _applyFilters: [4] },
    ],
    cost: { _applyFilters: [4] },
    damage: '<int:1-100>',
    heal: '<int:1-100>',
    destroy: true,
    do_nothing: true,
  }
}


Spell = {
  give: {},
  transform: {},
  add: {},
  summon: {},
  cost: {},
  damage: {},
  heal: {},
  destroy: {},
  cast: {},
}
