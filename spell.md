```javascript
// STEP 1: Support Hearthstone (else it's a freaking new game and thus no sandbox)
// STEP 2: Impliment STAGE 1 first, as much as possible

// Write code generically, but add cards carefully

// vv Rewrite for HEARTHSTONE

/*
  == AT ==
  -p ([ END / BEGINNING ])
  | if -p BEGINNING
  |  -q ([ YOUR_TURN / NEXT_TURN / GAME ])
  | else
  |  -q ([ YOUR_TURN / NEXT_TURN ])
  | if q YOUR_TURN
  |  -r TURN_COUNT():fn INT (1 ... ∞) (∞ = end-of-game)


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
  |  |  |  -c COUNT():fn INT (1 ... 100)
  | else
  |  -a ([ CHANGE_HEALTH ])
  |  -b ([ ADD / REMOVE ])
  |  -c COUNT():fn INT (1 ... 100)

  == UNTIL ==
  | if -2 CARD & -a not KILL
  |  -I ([ END / BEGINNING ])
  |  -II ([ YOUR_TURN / NEXT_TURN / GAME ])

  // Compared to hearthstone, this does not cover
  // - [x] health/attack-modifying spells
  // - [x] state-modifying spells
  // - [ ] mana-modifying spells
  // - [ ] card-cost-modifying spells
  // - [ ] spell-damage-modifying spells
  // - [ ] Draw/Discard/Return-to-hand-deck/Copy/Transform/summon/adapt/ card spells
  // - [ ] discover/choose-one/Joust spells
  // - [ ] "if" condition for spells (also includes combo & if action while in hand)
  // - [ ] "when" condition for spells
  // - [ ] Differentiate between heal and add-health
  // - [ ] spell cost health instead of mana
  // - [ ] Quest
  // - [ ] permanent passive spells (like in katakombs)
  // - [ ] spell to set-health on hero

  // can have SET for non-card too but OP if ALL + UNIT + CHANGE_HEALTH + SET + COUNT(5)
  // rework when we have more than 2 players (ALL/RANDOM + PLAYER + ENEMY/BOTH)
*/


/*
  == Mana Modifying ==
  (on card use)
    - Use N mana (always)
    - (opt) <one of>
      - Give N mana (till end-turn/game) (but not about max X)
      - Remove N mana from start-next-turn till end-next-turn (show lock)
      - Remove N mana from/on action till end-game

  (on your turn)
    - Gain N mana (N = 1)
*/

/*
  == Cost Modifying ==
  += AT
  - reduce/increase/set cost of random/all spells/minions/card(both) in your/enemy/both hand/deck/both by N
    - (opt) till you play a card

// first minion you play that turn costs 1 less
// reduce cost of all card by 1 end of your turn (PASSIVE)
// cost 1 less for bla bla // TODO
// Draw 3 cards, set/reduce cost // TODO
*/

/*
  == Spell Damage Modifying ==
  - When TYPE == SPELL and -a == CHANGE_HEALTH and -b == REMOVE
  - COUNT = COUNT + N
  - Till next-card/end-of-turn/end-of-game(PASSIVE)
*/

/*
  == Draw/Discard/Return-to-hand-deck/Copy/Transform/summon/adapt
  += AT
  - <combination of>
    - Draw/discard N cards from deck for self/enemy/both
    - Return a minion from board/hand to hand/deck for self/enemy (not hand-to-hand)
    - <one of>
      - Copy a minion at board, to hand/deck
      - Copy a random minion at hand
    - Transform (replace minion with someother)
    - Summon (add a minion to board)
    - Adapt (Choose 1 for the minion - add state/health/damage/specific-deathrattles) N times
      // there are only 10 adapts, check wiki
*/

/*
  ==
*/
```
