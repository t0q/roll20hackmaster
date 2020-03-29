on("chat:message", function(msg) {
    if (msg.type != "api") return;
    var command = msg.content.split(" ", 1);

    if (command == "!sheet_master_die") {
	    var args = arguments[0];

	    if (!args.hasOwnProperty('selected')) {
            return;
	    }
	    var result = ParseArgs(args);
	    PrettyPrint(result);
    }
});


function PrettyPrint(result) {
    
    var total     = result.rolled + result.ability_bonus + result.unskilled_bonus;
    
    var template  = "&{template:default}";
    var title     = "{{name=Mastery Die rolled by: " + result.caller + "}}";
    var line1     = "{{Rolled (" + result.dice_str + ") = " + result.rolled + "}}";
    var line2     = "{{Attribute Bonus (" + result.ability_name + ") =" + result.ability_bonus + "}}";
    if (result.unskilled_bonus) {
        var line3 = "{{Untrained Bonus = " + result.unskilled_bonus + "}}";
    } else {
        var line3 = "";
    }
    var line4    = "{{Total = " + total + "}}";
    
    var output   = template + title + line1 + line2 + line3 + line4;
    sendChat("", output);
}


function ParseArgs(args) {
    var caller   = args.who;
    var gid      = args.selected[0]._id;
    var gtoken   = getObj('graphic', gid);
    var cid      = gtoken.get('represents');
    var ctoken   = getObj('character', cid);
    
    var content       = args.content;
    var ability_name  = content.split(" ").splice(-1)[0];
    var ability       = Number(getAttrByName(cid, ability_name));
    var ability_bonus = getBonus(ability);

    var dieroll       = args.inlinerolls[0];
    var rolled        = dieroll.results.total;
    
    // HACK: Unskilled rolls have '+ 0' at the end.
    var unskilled_bonus = 0;
    if (dieroll.expression.split('+').length > 1) {
        unskilled_bonus = ability;
    }

    var dice_str = dieroll.expression.split(' ')[0];

    var result = {'ability_bonus'  : ability_bonus,
                  'ability_name'   : ability_name,
                  'caller'         : caller,
                  'dice_str'       : dice_str,
                  'unskilled_bonus': unskilled_bonus,
                  'rolled'         : rolled
    };
    return result;
}

function getBonus(ability) {
    var raw_bonus = Math.floor(ability/2 - 5);
    return Math.min(raw_bonus, 5);
}
