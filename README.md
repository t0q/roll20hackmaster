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

# hm_attack
| argument | description |
| -------- | ----------- |
| name     | Name of actor.
| weapon   | Name of weapon.
| speed    | Weapon speed.
| reach    | Weapon reach.
| atk_roll | Attack roll.
| damage   | Damage roll.
Example usage: `&{template:hm_attack} {{name=Orc Captain}} {{weapon=Longsword}} {{speed=10}} {{reach=3.5}} {{atk_roll=[[1d20+2]]}}`

# hm_defend
| argument | description |
| -------- | ----------- |
| name     | Name of actor.
| weapon   | Name of weapon.
| def_roll | Defense roll. Use a [[1d20cs>19cfc9]] here, so we can detect a near perfect defense.
Example usage: `&{template:hm_defend} {{name=Orc Captain}} {{weapon=Longsword}} {{def_roll=[[1d20cs>19cf19 +6]]}} {{dr=2}} {{sdr=6}}`

### Thanks!

I doubt any of this would have existed if not for FeltZ. His excellent character sheet and init tracker form the backbone of this silly little repo, and the majority of my changes are nothing more than timid tinkering of his existing work. Rock on, FeltZ!
