# Game dynamics

## V1 dynamics
> Hearthstone style'ish
> No hero power though (will implement later, or not)

Entities
  - Game
    - Player
      - Mana
      - Health
      - Deck
        - [x] Limit
      - Board
        - [x] Limit
        - [x] Lanes
        - Card
          - Mana
          - Attack
          - Health
          - State
          - Type (minion/spell)
    - Starting player
  - User

Actions
  - Card
    - Cast a spell on play (battlecry)
    - Cast a spell on death (deathrattle)
    - Cast a spell on use (active spell)
    - Cast a spell each turn (passive spell)
    - [x] Apply buff/debuff when present
    - [x] Cast a spell on return to hand
    - [x] Cast a spell on return to deck
  - Spell (combination of)
    - Deal damage
    - Kill a card
    - Take n cards from deck
    - Buff/debuff card (±x/±x or give/remove a state)
    - [x] move to hand/deck of player/enemy
    - ^ Applied on
      - On a player
      - On card
        - all/any/random (-your/-enemy/-both) cards
        - in board/hand/deck
    - [x] ^ Applied if
      - Always
      - Criteria
  - Board
    - Hold a card
    - Kill a card
    - Discard a card
  - Deck
    - Draw n cards
  - Player
    - Play a card
    - Use a card
    - End turn

Card states
  - Taunt
  - Poisonous
  - Ghosted (physical immune)
  - Blessed (magic immune - bkb)
  - [x] Stealth (invisible)
  - [x] Devine shield
  - [x] Overload
  - [x] Windfury
  - Silenced

### Thoughts
- More than 2 players?
- Play out of a common deck?
- Realtime play? (instead of turn based)
  - or rethink the turn (and end turn concept)
- support for multiple languages?
