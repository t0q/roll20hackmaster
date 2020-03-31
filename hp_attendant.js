// Example usage: !populate_hp [[@{selected|hp_range}]]
// Set token's top_save to creature's ToP save value.

on("chat:message", function(msg) {
    if (msg.type != "api") return;

    var command = msg.content.split(" ", 1);

	if (command == "!populate_hp" && playerIsGM(msg.playerid)) {
	    var gid    = msg.selected[0]['_id'];
        var gtoken = getObj('graphic', gid);
        var args   = arguments[0]['inlinerolls'][0];
        Populate(gtoken, args);
    }
});

on("change:graphic:bar3_value", function(obj, prev) {
    var hp_this = obj.get("bar3_value");
    var hp_max  = obj.get("bar3_max");
    var hp_prev = prev.bar3_value;
    
    var wound   = hp_prev - hp_this;
 
    // Assuming 40% here, as per HoB, p11 
    var limit = Math.ceil(hp_max * 0.4);

    if (wound > limit) {
        var cid = obj.get("represents");
        
        var top_save = getAttrByName(cid, "top_save");
        var top_roll = randomInteger(20);

        var successful = top_roll <= top_save;
        
        if (successful) {
            var top_result = "Passed.";
        } else {
            if (top_roll == 20) {
                var top_result = "Unconscious!"   +
                                 "}}{{Duration="  + "[[5d6!p]]"             +
                                 " minutes";
            } else {
                var top_result = "Incapacitated!" +
                                 "}}{{Duration="  + (top_roll - top_save)*5 +
                                 " seconds";
            }
        }

        var card = "&{template:hm_std}"         +
                   "{{name=ToP Save for "       +
                   obj.get('name')              +
                   "}}{{wound="    + wound      +
                   "}}{{limit="    + limit      +
                   "}}{{ToP Save=" + top_save   +
                   "}}{{ToP Roll=" + top_roll   +
                   "}}{{Result="   + top_result +
                   "}}";
        sendChat("AutoDM", "/w gm " + card); 
    }
});

function Populate(gtoken, dice) {
    var hp = dice.results.total;
    gtoken.set('bar3_value', hp);
    gtoken.set('bar3_max', hp);
}
