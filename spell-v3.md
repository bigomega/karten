#refs

#cardCombinations {
  - card
    - any
    - minion or spell
    - minion or weapon
    - spell or weapon
}

#minionSpec {
  - minion
    [
      - of <GROUP>
      - with <STATE/EFFECT>
      - with <TAG>
    ]
}

## Spell IF
=============
(Condition for spells)
(Limits any spell - multiple instances can be added with AND or OR)
<--AND-->
  - if target card
    - is minion
      - #minionSpec
      - with attack (>|<|=) x
      - with health (>|<|=) y
      - with stat (>|<|=) x (AND/OR) (>|<|=) y
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
  - count
    <--AND-->
      - cards
      - minions
      - spells
      - weapons
    <--AND-->
      - in board (only for minions)
      - in hand
      - in deck
    <--AND-->
      - (>|<|=) N
  - the board
    <--AND-->
      - your side contains
      - enemy side contains
      - both side contains
    <--AND-->
      - ANY
      - ALL
    <--AND-->
      - minion
        - of
          - any type
          - <GROUP>
        - with
          - any state
          - <STATE/EFFECT>
          - <TAG>
        - with attack (>|<|=) x
        - with health (>|<|=) y
        - with stat (>|<|=) x (AND/OR) (>|<|=) y
  - hero
    <--AND-->
      - enemy
      - self
      - either
      - both
    <--AND-->
      - is of <HERO_STATE>
      - has health (>|<|=) H
      - has attack (>|<|=) x
<--AND--> (OPT)
  - cast <Spell> instead
  - cast <Spell> also

# Spells
=========

## Minion Spells (in game)
==========================
>> Target group
  <--AND (1)-->
    - all minion
    - self-minion (Gain for minions) + [[ SKIP CHOICE 3,4 ]] << when the is spell on a minion
    - random N minion(s)
    - chosen minion
    - edge minions (those on ends)
    - adjacent of
      - chosen minion
      - random minion
    - last played N minion(s) [[ SKIP CHOICE 3,4 ]]
      - by you
      - by enemy
      - by either
    - last drawn N card(s) [[ SKIP CHOICE 3,4 ]]
      - by you
      - by enemy
      - by either
  <--AND (2)-->
    - of
      - any type
      - <GROUP>
    - with
      - any state
      - <STATE/EFFECT>
      - <TAG>
  <--AND (3)-->
    - in board side
    - in hand
    - in deck
  <--AND (4)-->
    - yours
    - enemmy's
    - either (random)
    - both

>> Action
  - Give
    - stats ±x/±y
      - value defined
      - value from "when condition"
    - stat x/y (hard set)
    - <STATE>
    - Deathrattle
      - <Spell>

  - Transform into (if in board)
    - <Minion>
    - random
      - of
        - any type
        - <GROUP>
      - with
        - any state
        - <STATE/EFFECT>
        - <TAG>
      - that costs
        - random
        - same
        - N more
        - N less
      - cost
        - health
        - mana

  - Add #1
    <--AND-->
      - a Copy
      - the Same
    <--AND-->
      - to hand
      - to deck (shuffled)
    <--AND-->
      - yours
      - enemmy's
      - either (random)
      - both

  - Summon #2
    <--AND--> (for minions only)
      - as new
      - with new stat
        - ±x/±y
        - x/y
      - with all buffs
    <--AND-->
      - to you
      - to enemy
      - to either (random)
      - to both

  - Cost (if in hand/deck) #3
    - same
    - ±N
    - N
    - health instead

  - Damage N (if in board)
  - Heal N (if in board)
  - Destroy

>> Also
  - do nothing
  - do an "Action" on target group
  - do an "Action" on adjacent of target group (if in board)
  - add another "Also"

>> the spell result (OPT)
  <--AND-->
  - if kill minion in target group
    <--AND-->
      - ANY
      - ALL
    <--AND-->
      - of
        - any type
        - <GROUP>
      - with
        - any state
        - <STATE/EFFECT>
        - <TAG>
  - if doesn't kill minion in target group
    - ANY
    - ALL
  <--AND-->
  - then
    - cast a <Spell>
    - cast self again


## Card Spells (not in game)
==============================
>> Target
  - <Minion>
  - <SpellCard>
    - any type
    - of <TAG> (eg., mage spell)
  - <Weapon>
  - random N {1 ≤ N ≤ ∞}
    <--AND-->
      - minion
      - spell
      - weapon
      - #cardCombinations
    <--AND-->
      - of
        - any type
        - <GROUP>
        - <TAG>
      - with
        - any state
        - <STATE/EFFECT>
    <--AND-->
      - from Universal collection
      - from list
        <--AND-->
          - minions
            - died
                - from your board
                - from enemy board
            - played
              - by you
              - by enemy
              - by both
          - cards played
              - by you
              - by enemy
              - by both
          - spells played
              - by you
              - by enemy
              - by both
        <--AND-->
          - this turn
          - last turn
          - this game (so far)
    <--AND-->
      (if N > 1)
      - reapeated (list stays same for every random)
      - non-repeated (previously random'd minions removed from list)

>> Action
  - #ref #1 (Summon/Cast)
  - #ref #2 (Add)
  - #ref #3 (Cost)

>> Also
  - do nothing
  - do an "Action" on target group
  - add another "Also"

## Weapon Spells
====================
>> Target
  <--AND-->
    - all weapon
    - random N weapon(s)
  <--AND-->
    - in slot
    - in hand
    - in deck
  <--AND-->
    - yours
    - enemmy's
    - either (random)
    - both

>> Action
  - Give
    - ±x/±y
    - <STATE/EFFECT>
  - return to
    <--AND-->
      - slot (equip)
      - deck
      - hand
    <--AND-->
      - yours
      - enemmy's
      - either (random)
      - both

## On-hero Spells
===================
- Gain
  - N armour
  - ±x attack


## Other Spells (generic and more)
====================
- Cost change
  <--AND-->
    - from target
    - random
    - all
  <--AND-->
    - spell
    - weapon
    - card
  <--AND-->
    - in hand
    - in deck
  <--AND-->
    - yours
    - enemmy's
    - either (random)
    - both
  <--AND-->
    - by ±N
    - N
  <--AND-->
    - mana
    - health instead

- Draw N
  <--AND-->
    - minion
      - of
        - any type
        - <GROUP>
      - with
        - any state
        - <STATE/EFFECT>
        - <TAG>
    - spell
    - weapon
    - card
  <--AND-->
    - do nothing
    - for every card drawn, as target
      - cast <Spell> (Summon/Discard - using a if) (reduce cost)

- ±N mana

Spell action count
===================
- once
- N times {2 ≤ N ≤ ∞}
- for every
  - mana
    - you hold
    - overloaded
    - slot you hold
  - time hero spell is used
    - by you
    - by enemy
    - by either
  - time played a
    <--AND-->
      - minion
        - of
          - any type
          - <GROUP>
        - with
          - any state
          - <STATE/EFFECT>
          - <TAG>
      - spell
      - weapon
      - card
    <--AND-->
      - this turn
      - this game
    <--AND-->
      - by you
      - by enemy
      - by either
  - card discarded this game
  - minion in board
    <--AND-->
      - of
        - any type
        - <GROUP>
      - with
        - any state
        - <STATE/EFFECT>
        - <TAG>
    <--AND-->
      - damaged
      - undamage
      - both damaged or undamaged
    <--AND-->
      - your side
      - enemy side
      - both side


Spell AT
===========
(Decides "when" the spell will take effect)
- At
  <--AND-->
    - Start
    - End
  <--AND-->
    - your turn
    - next turn
- At start of the game


Spell UNTIL
=============
(Decides if the action of a spell to be reversed and when)
- end of game (Mostly)
- end of current turn
- you play a
  - card
  - #minionSpec
  - spell
  - weapon
- a player dies


# Minion specific
==================

## Active (Ongoing conditions on minion/weapon in play.)
====================
- When
  - Enemy
    - Draw a
      - #minionSpec
      - spell
      - weapon
      - #cardCombinations
  - You
    - Draw a
      - #minionSpec
      - spell
      - weapon
      - #cardCombinations
    - Summon a minion
      - of
        - any type
        - <GROUP>
      - with
        - any state
        - <STATE/EFFECT>
        - <TAG>
    - Cast a spell
    - Equip a weapon
  - hero
    <--AND-->
      - you
      - enemy
      - either
    <--AND-->
      - is healed by N
      - is damaged by N
  - a minion
    <--AND-->
      - in board
        - your side
        - enemy side
        - either side
    <--AND-->
      - lose STATE="Divine Shield"
      - Die
  - self-minion
    - is drawn from deck
    - is discarded
    - take damage
      - any
      - by N
    - is healed
      - any
      - by N
    - is targetted by a spell
      - by you
      - by enemy
      - by either

- trigger <Spell>

## Passive
============
- changes minion stats
- changes cost
- makes hero immune
- increases spell damage
