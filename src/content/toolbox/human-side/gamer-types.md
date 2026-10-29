---
kind: note
title: Gamer types
summary: The best-known ways to sort players by what they enjoy, from Bartle’s four types to Quantic Foundry’s nine, and which games suit each type.
category: Players and games
status: seedling
created: 2026-10-29
order: 1
draft: true
tags: [games, players, motivation, segmentation]
---

Game design starts with understanding people. In many ways, a game’s job is to make players want to act, so it helps to know how people’s minds work.

The question behind these notes: what are the most common ways to classify gamers, and what kinds of games suit each type?

## Two ways to classify

| Approach | How it works | Examples |
| --- | --- | --- |
| Typology (top-down) | Define a few types from theory or observation, then sort people into them | Bartle, Stewart, DGD1, BrainHex |
| Component model (bottom-up, data-driven) | Measure each person on several motivations, then use clustering to find types in the data | Nick Yee’s research on online-game motivations, Quantic Foundry |

Here is how the models appeared over time:

```
1996  Bartle: 4 player types (text-based multiplayer MUDs)
2003  Bartle: extended to 8 types
2005  Bateman: DGD1 (4 play styles + Casual/Hardcore modes)
2006  Nick Yee: component model of online-game motivations
2011  Stewart: Unified Model (Keirsey temperaments × Bartle types)
2011  Nacke & Bateman: BrainHex (7 archetypes)
2015+ Quantic Foundry: 12 motivations → 9 gamer types
```

Early models were built on observation and theory. Later ones lean more and more on large surveys.

## Bartle’s player types

Richard Bartle co-created the first MUD (Multi-User Dungeon), a text-based multiplayer game. His 1996 paper, *Hearts, Clubs, Diamonds, Spades: Players Who Suit MUDs*, sorts players along two axes.

| Axis | Ends | What it asks |
| --- | --- | --- |
| Focus | Players or World | Does the fun come from other people, or from the game world itself? |
| Mode | Acting or Interacting | Do you want to act on the target (one way), or engage with it (both ways)? |

### Four types

| Type | Axes | What drives them | Games that suit them | Examples |
| --- | --- | --- | --- | --- |
| ♦ Achiever | Acting × World | Reaching goals and building status: levels, gear, achievements, leaderboards | RPGs and MMOs with clear progression and collecting, games with rich achievement systems | World of Warcraft, Diablo, Pokémon |
| ♠ Explorer | Interacting × World | Finding secrets and learning how the world works. Discovery is the reward. | Open worlds, deep lore, hidden content, complex systems | The Legend of Zelda: Breath of the Wild, Outer Wilds, Minecraft |
| ♥ Socializer | Interacting × Players | Relationships and belonging. The game is a social stage. | MMOs, co-op games, party games, community-driven games | Final Fantasy XIV, Animal Crossing (online), Among Us |
| ♣ Killer | Acting × Players | Competing, winning over others, having an effect on them | PvP, competitive shooters, fighting games, MOBAs, open-world PvP survival | League of Legends, Counter-Strike, Rust |

The example games are my own, picked to match each type. They don’t come from Bartle’s paper.

### Eight types

In 2003 Bartle added a third axis: explicit (planned) or implicit (intuitive). Each type splits in two.

| Base type | Explicit | Implicit |
| --- | --- | --- |
| Achiever | Planner | Opportunist |
| Explorer | Scientist | Hacker |
| Socializer | Networker | Friend |
| Killer | Politician | Griefer |

### Its limits

- Bartle studied multiplayer MUDs in the 1990s, not all games.
- The most useful part of his model is how the types affect each other. Too many Killers drive Socializers away, and Achievers need someone to show off to. Designing a multiplayer game means keeping these groups in balance.

## Stewart’s unified model

Bart Stewart published this model on Gamasutra (now Game Developer) in 2011. There is a Chinese translation on 36Kr.

His idea is that Bartle’s four types are Keirsey’s four temperaments showing up in games.

| Keirsey temperament | Bartle type | Core motive | Genres Stewart links to it |
| --- | --- | --- | --- |
| Artisan | ♣ Killer | Power, stimulation (Do) | Action, racing, shooters, horror, gambling |
| Guardian | ♦ Achiever | Security (Have) | Collecting, levelling, crafting, points, guilds |
| Rational | ♠ Explorer | Knowledge (Know) | Puzzles, strategy, simulation, creative building |
| Idealist | ♥ Socializer | Identity (Be) | Story, role-play, co-op, social play |

He also gives examples by genre:

| Genre | Main appeal |
| --- | --- |
| FPS (Halo, Call of Duty) | Killer + Achiever |
| RPG (Baldur’s Gate, Fallout) | Achiever + Explorer |
| MMORPG (World of Warcraft) | Achiever + Explorer + Socializer |
| Turn-based strategy (Civilization) | Explorer |
| Simulation (The Sims) | Explorer |
| Social games (FarmVille) | Socializer + Achiever |

A caveat. The model makes you think, but it is Stewart’s own interpretation, and nobody has tested it with data. Hamari and Tuunanen’s review says it squeezes too many different ideas into four boxes, so some of the links feel forced. The links are under Further reading.

## DGD1 and BrainHex

### DGD1

Chris Bateman proposed DGD1 in 2005. DGD stands for Demographic Game Design. He combined MBTI with player surveys and came up with four play styles. Stewart argues that these fill the gaps between Bartle’s four types.

| Type | What they’re like | Games that suit them |
| --- | --- | --- |
| Conqueror | Wants to beat hard challenges and enjoys winning | Difficult action games, boss fights |
| Manager | Wants to master complex systems, strategies and processes | Strategy, management sims, Minecraft-style games |
| Wanderer | Wants fun experiences and cares little about goals | Open worlds, atmospheric games, Second Life |
| Participant | Wants to take part in stories and relationships | The Sims, story-driven and social games |

DGD1 also has two modes. Casual players invest little and drop in and out easily. Hardcore players invest a lot.

### BrainHex

BrainHex, by Nacke, Bateman and Mandryk (2011 to 2014), came after DGD. It draws on brain research about reward and emotion and describes seven player archetypes. Each player gets a main type and a second type.

| Archetype | Where the fun comes from | Games that suit them | Examples |
| --- | --- | --- | --- |
| Seeker | Curiosity, wonder, discovery | Exploration, open worlds | Skyrim, Subnautica |
| Survivor | The thrill of fear, then the relief of being safe | Horror, survival horror | Resident Evil, Amnesia |
| Daredevil | The rush of risk and speed, playing on the edge | Racing, parkour, fast platformers | Mirror’s Edge, Forza Horizon |
| Mastermind | Solving puzzles and finding efficient strategies | Puzzle, strategy | Portal, Civilization |
| Conqueror | Beating tough opponents, winning after a struggle | Hard action games, competitive games | Dark Souls, fighting games |
| Socialiser | Connecting with and helping people they trust | Co-op, MMOs, party games | Final Fantasy XIV, It Takes Two |
| Achiever | Finishing goals and collecting everything | Collecting, 100% completion, long-term progression | Pokémon, open-world collectibles |

The researchers put the archetypes into three groups:

- Skill: Conqueror, Mastermind, Daredevil
- Aesthetics and experience: Seeker, Survivor, Socialiser
- Goals: Achiever

Again, the example games are my own. The BrainHex paper says DGD1’s Conqueror, Manager, Wanderer and Participant roughly match BrainHex’s Conqueror, Mastermind, Seeker and Socialiser.

## Quantic Foundry’s model

Quantic Foundry is a gamer research company founded by Nick Yee and Nicolas Ducheneaut. Their model is based on more than 500,000 gamers who have taken their Gamer Motivation Profile survey.

### Twelve motivations

| Cluster | Category | Motivation | What it means |
| --- | --- | --- | --- |
| Action–Social | Action | Destruction | Guns, explosions, chaos |
| | | Excitement | Fast pace, surprises, intensity |
| | Social | Competition | Duels, matches, rankings |
| | | Community | Teaming up, chatting, cooperating |
| Mastery–Achievement | Mastery | Challenge | High difficulty, lots of practice |
| | | Strategy | Planning, careful decisions |
| | Achievement | Completion | Finishing every quest, collecting everything |
| | | Power | Getting stronger, top gear |
| Immersion–Creativity | Immersion | Fantasy | Being someone else, somewhere else |
| | | Story | Plot and characters |
| | Creativity | Design | Customising, building, expressing yourself |
| | | Discovery | Exploring, experimenting |

### Nine gamer types

When you cluster gamers by their twelve motivation scores, you get nine types. Someone with a clear second type gets a blend, like Architect / Bard, which gives 81 combinations in all.

| Type | What they’re like | Games that suit them (official examples) |
| --- | --- | --- |
| Acrobat | Plays alone. Looks for hard challenges and practises until they master them. Doesn’t care about world-building or decoration. | Super Metroid, Tetris, The Binding of Isaac |
| Gardener | Likes calm, relaxing tasks with clear rules and no need to plan many steps ahead | Candy Crush, Animal Crossing |
| Slayer | Wants to be the hero of a cinematic story. Sees games as action movies you can play. | Linear, story-driven action games |
| Skirmisher | Likes fast team arenas they can jump into, without much difficulty or planning | Call of Duty, Battlefield |
| Gladiator | Hardcore. Wants everything: team arenas, explosive action, progression, strategy, a rich world. | Destiny, Gears of War, Black Desert Online |
| Ninja | Wants challenge, strategy, speed and competition. Tests skill and wits against others. | StarCraft, Street Fighter |
| Bounty Hunter | Wants to make the world their own by customising and exploring, and to watch their character grow powerful | Saints Row, Far Cry, Mass Effect |
| Architect | Plays alone and slowly. Plans and decides, building something tall and lasting over time. | Europa Universalis, Civilization |
| Bard | Social. Creates stories with a community in a world full of lore. The game is a stage. | The Secret World, Final Fantasy XIV |

### Pairs that are easy to mix up

- Slayer and Bounty Hunter both love solo action games. The Slayer wants a planned, cinematic experience. The Bounty Hunter wants to explore, customise and watch their character get stronger.
- Acrobat and Ninja both want challenge. The Acrobat practises alone. The Ninja tests skill and strategy against other people.
- Skirmisher and Gladiator both like team shooters. The Skirmisher plays casually. The Gladiator wants everything, in depth.

The authors warn that clustering squashes fine detail into broad groups, so your type is only a starting point. The real detail is in your scores on the twelve motivations.

## Engagement and spending

The models above explain why people play. The games industry also uses two other splits: how much people play, and whether they pay.

### By engagement

| Type | What they’re like | Typical games |
| --- | --- | --- |
| Casual | Plays in short bursts, likes simple games that are easy to learn | Mobile match-3, casual management |
| Midcore | Wants some depth without a big time commitment | Mobile strategy, light RPGs |
| Hardcore | Puts in lots of time, goes for skill and mastery | Competitive games, MMOs, hard games |

### By spending (free-to-play)

| Type | What they’re like |
| --- | --- |
| Whales | Very few players, but they bring in most of the revenue |
| Dolphins | Spend regularly, in moderate amounts |
| Minnows | Make small purchases now and then |
| Non-payers | The large majority. They never pay, but they fill the game world and act as opponents. |

The share of players in each group is an industry rule of thumb. Definitions vary a lot between games and companies.

Put together, a full player profile is motivation × engagement × spending. A “hardcore × Ninja × non-payer” and a “casual × Gardener × minnow” need very different content and offers.

## Comparing the models

This table shows rough matches only. Each model slices players differently, so the types are not exact equivalents.

| Bartle | Keirsey (Stewart) | BrainHex | Related Quantic Foundry motivations | Closest Quantic Foundry types |
| --- | --- | --- | --- | --- |
| ♦ Achiever | Guardian | Achiever, Conqueror | Completion, Power, Challenge | Bounty Hunter, Gardener |
| ♠ Explorer | Rational | Seeker, Mastermind | Discovery, Strategy, Story | Architect, Acrobat |
| ♥ Socializer | Idealist | Socialiser | Community, Fantasy, Design | Bard |
| ♣ Killer | Artisan | Daredevil, Conqueror | Competition, Destruction, Excitement | Skirmisher, Ninja, Gladiator |

The Slayer (story plus solo action) and the Survivor (horror) don’t fit anywhere in Bartle’s model. Bartle only studied multiplayer games, so solo story games and horror were outside what he looked at. That gap is one reason later models got more detailed.

## Using the models

### Find your own type

1. Take the Quantic Foundry Gamer Motivation Profile (about 5 minutes) and look at your twelve motivation scores.
2. Try the BrainHex survey to see your main and second type.
3. Compare the results with games you love and games you gave up on.

### Pick games by motivation

Look past the genre to the motivations a game serves. Take RPGs:

- a linear, story-driven RPG suits a Slayer
- an open-world RPG you can customise suits a Bounty Hunter
- an online MMO suits a Bard

### Limits

| Limit | Why it matters |
| --- | --- |
| Most people are mixed | Most players have several motivations, and these shift between games and over a lifetime |
| Scope | Bartle’s model came from multiplayer MUDs and may not apply to single-player games |
| Different levels of evidence | Quantic Foundry and BrainHex are based on large surveys, Bartle on observation. Stewart’s model is a theory that hasn’t been tested with data. |
| Stereotyping | Some designers warn that designing for types can reinforce stereotypes about who “should” play what. Bartle’s original description of Killers is also quite negative. |
| Sample bias | People who volunteer for surveys may not represent all gamers. BrainHex’s early sample, for example, was mostly male. |

So I use these models as a starting point for understanding players, and I try not to use them as labels for people.

## Further reading

**Bartle**
- [Bartle (1996), Hearts, Clubs, Diamonds, Spades: Players Who Suit MUDs](https://mud.co.uk/richard/hcds.htm)
- [Wikipedia, Bartle taxonomy of player types](https://en.wikipedia.org/wiki/Bartle_taxonomy_of_player_types)

**Stewart’s unified model**
- [Bart Stewart’s articles on Game Developer (formerly Gamasutra), including Personality and Play Styles: A Unified Model](https://www.gamedeveloper.com/author/bart-stewart)
- [Game Developer’s introduction to the Unified Model](https://www.gamedeveloper.com/design/feature-understanding-your-players-completely)
- [Chinese translation (36Kr)](https://36kr.com/p/1723245199361)
- [Keirsey temperament overview](https://keirsey.com/temperament-overview/)

**DGD1 and BrainHex**
- [Nacke, Bateman & Mandryk (2014), BrainHex: A neurobiological gamer typology survey](https://www.sciencedirect.com/science/article/abs/pii/S1875952113000086)
- [Early BrainHex paper (2011)](https://www.researchgate.net/publication/220851473_BrainHex_Preliminary_Results_from_a_Neurobiological_Gamer_Typology_Survey)
- [BrainHex online survey (third-party site)](https://psytests.org/cyber/brhexen.html)

**Quantic Foundry**
- [The 9 Quantic Gamer Types](https://quanticfoundry.com/gamer-types/)
- [Gamer Motivation Profile survey](https://apps.quanticfoundry.com/surveys/start/gamerprofile/)
- [The 12-motivation model](https://quanticfoundry.com/#motivation-model)
- [Quantic Foundry blog (data findings)](https://quanticfoundry.com/blog/)
- [Nick Yee (2006), Motivations for Play in Online Games](https://doi.org/10.1089/cpb.2006.9.772)

**Reviews and critiques**
- [Hamari & Tuunanen, Player Types: A Meta-synthesis](https://fileserver-az.core.ac.uk/download/pdf/250142033.pdf)
- [Five Ways Games Appeal to Players (on the stereotyping problem with typologies)](https://www.gamedeveloper.com/design/five-ways-games-appeal-to-players)
- [Hunicke, LeBlanc & Zubek, MDA: A Formal Approach to Game Design and Game Research](https://users.cs.northwestern.edu/~hunicke/MDA.pdf)
