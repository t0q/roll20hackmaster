# roll20hackmaster

This repository contains a mixture of scripts I've written or existing hackmaster resources which I've enhanced and (I hope) improved for a better gameplay experience for both players and GMs alike.

I've mostly done this work for myself, but there seems to be an impressive lack of vtt resources for a Hackmaster GM. The result has been this repo, where I try to provide tools for us and hope I can make everyone's day a little nicer in the process!

You can find the following resources here:
 - Modified Hackmaster Character sheets.
 - Code to populate monster HP and handle ToP calculations.
 - Modified init tracker code.
 - A lot more to come.

### Templates
Note that all template arguments are optional. You might wish to display just a creature's attack roll, then roll for damage after the target has opted not to spend Luck points to alter the roll. Or you might wish to show an NPC's defense, but whisper her DR values to yourself.

# hm_std
| argument | description                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| name     | Name of actor.                                                                          |
| weapon   | Name of weapon.                                                                         |
| speed    | Weapon speed.                                                                           |
| reach    | Weapon reach.                                                                           |
| atk_roll | Attack roll. Use a [[1d20cs>19cf1cf19]] here, so we can detect a near perfect attack.   |
| def_roll | Defense roll. Use a [[1d20cs>19cf1cf19]] here, so we can detect a near perfect defense. |
| damage   | Damage roll.                                                                            |
| dr       | Damage reduction without a shield.                                                      |
| sdr      | Damage reduction due to a shield.                                                       |

This template will also accept arbitrary parameters.

Example usage: `&{template:hm_std} {{name=Orc Captain attacks!}} {{weapon=Longsword}} {{speed=10}} {{reach=3.5}} {{atk_roll=[[1d20cs>19cf1cf19 +2]]}}`

Example usage: `&{template:hm_std} {{name=Orc Captain defends!}} {{weapon=Longsword}} {{def_roll=[[1d20cs>19cf1cf19 +6]]}} {{dr=2}} {{sdr=6}}`

# hm_spell
| argument   | description          |
| ---------  | -------------------- |
| name       | Name of spell.       |
| caster     | Name of spellcaster. | 
| level      | Spell level.         |
| components | V, S, M, etc         |
| speed      | Casting time.        | 

Example usage: `&{template:hm_spell} {{name=Fireball}} {{caster=@{Noir Lotus|character_name}}} {{level=10}} {{components=V, S, M}} {{speed=300}} {{cost=140}}`

### Thanks!

I doubt any of this would have existed if not for FeltZ. His excellent character sheet and init tracker form the backbone of this silly little repo, and the majority of my changes are nothing more than timid tinkering of his existing work. Rock on, FeltZ!
