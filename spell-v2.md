- Minion
  - Universe (= Hearthstone) - for later expansions
  - Group (Murloc/Daemons/Beast/Mech/...)
  - tag (DEATH_KNIGHT_EXP) TK
- Spell
- Weapon

EFFECT
- ongoing: Spell (if/when/at)
- battlecry: Spell
- deathrattle: Spell
- overload: N
  ^ battlecry: lock N mana in your next turn

STATE
- immune
- lifesteal
- charge
- frozen
- taunt
- poisonous
- silenced
- blessed (can't be spell/hero-power targeted)
- divine shield

HERO STATE
- immune
- frozen
- blessed (can't be spell/hero-power targeted)
- divine shield

======
RULES
======
>> Being inlusive. ie., all spells must be possible by these rules, not necessary that the rules should only create available spells

Ongoing conditions (on minion/weapon)
==============
(Triggers a spell)
- When
  - You
    - Summon a minion
      - of
        - any type
        - <GROUP>
        - <TAG>
      - with
        - any state
        - <STATE/EFFECT>
    - Cast a spell
  - Your hero
    - is healed by N
  - a minion
    <--AND-->
      - in board
        - your side
        - enemy side
        - either side
    <--AND-->
      - lose STATE="Divine Shield"
      - Die

(Decides "when" the spell will take effect)
- At
  <--AND-->
    - Start
      - your turn
      - next turn
      - game
    - End
      - your turn
      - next turn

Spells (can be used on Battlecry/Deathrattle/Ongoing)
==========
- Give
  <--AND (1)-->
    - all minion
    - minion-self (Gain for minions) + [[ SKIP CHOICE 3 ]] << when the is spell on a minion
    - random minion
    - chosen minion
  <--AND (2)-->
    - of
      - any type
      - <GROUP>
    - with
      - any state
      - <STATE/EFFECT>
  <--AND (3)-->
    - in board
      - your side (friendly)
      - enemy side
      - either
    - in hand
      - yours
      - enemmy's
      - both
  <--AND (4)-->
    - stats +x/+y
      - value defined
      - value from "when condition"
      - for every
        - time hero spell is used
          - by you
        - time you've played a card with <STATE>
        - card discarded this game
        - card in board
          - your side
          - enemy side
          - either side
        - damaged card in board
          - your side
          - enemy side
          - either side
    - stats x/y (hard set)
    - <STATE>
    - Deathrattle
      - <Spell>
  <--AND (5)-->
    - ALSO do nothing
    - ALSO give adjacent minions (only applied on board)
      - stats +x/+y
      - <STATE>

- Damage N
  - self hero
  - enemy hero
  - any unit
  - any enemy unit
  - any minion
    - in enemy board
    - in self board
    - either
  - all minion
    - in enemy board
    - in self board
    - both
  - last played minion
  - adjacent minions of selected

- Summon
  - <Minion>
  - minion-self (deathrattle/batlecry)
    - as new
    - with new stat +x/+y
    - with all previous buffs
  - dynamic minion
    <--AND-->
      - of
        - any type
        - <GROUP>
        - <TAG>
    <--AND-->
      - random
        - from Universal collection
        - that died from your board this game
      - all
        - that died from your board this game

- Copy
  - all minion
    - opponent's deck
      - shuffle into your deck
    - your hand
      - shuffle into your deck
  - random N minions
    - from opponent hand
      - add to hand
    - from opponent deck
      - add to hand

- Add
  <--AND-->
    - <Minion>
    - <Spell>
    - <Weapon>
    - dynamic card
      <--AND-->
        - minion
        - spell
        - weapon
        - card
      <--AND-->
        - random
          - of
            - any type
            - <GROUP>
            - <TAG>
        - chosen
          - of
            - any type
            - <GROUP>
            - <TAG>
  <--AND-->
    - to hand
      - yours
      - enemmy's
      - both
    - to deck

- Cost
  <--AND-->
    - minion
      - of
        - any type
        - <GROUP>
        - <TYPE>
        - <STATE/EFFECT>
    - spell
    - weapon
    - card
  <--AND-->
    - in hand
      - yours
      - enemmy's
      - both
    - in your deck
  <--AND-->
    - reduce by N
    - increase by N
    - set to N

- +1 mana
- Transform a minion to someother
  - <Minion>
- Gain (your hero)
  - N armour
  - x attack

<<<<
PS.
>>>>
  - Gain = "Give" on self


IF
=======
(Limits any spell - multiple instances can be added with AND or OR)
- your deck contains
  - no duplicates
  - minions with
    - <STATE/EFFECT>
    - <GROUP>
- current turn is
  - enemy's (deathrattle)
- your hand contains
  - minions with
    - <STATE/EFFECT>
    - <GROUP>
- the board
  <--AND-->
    - your side contains
    - enemy side contains
    - either side contains
  <--AND-->
    - minion of <STATE>
- hero
  <--AND-->
    - enemy hero
    - self hero
    - either hero
  <--AND-->
    - is of <HERO_STATE>

UNTIL
========
- you play a
  - card
  - minion
  - spell
  - weapon
- end of current turn
- end of game
- self-minion on board
