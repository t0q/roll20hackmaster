/*
 * The majority of this tracker is the work of FeltZ, who in turn re-used things from
 * Chris N and HoneyBadger's scripts.
 *
 * Rock on, guys.
 * -n0q
 */

var AnnounceNewSecond  = true;
var tint_color_turn    = '#FFFF00';     // Tint color for the current tokens turn
var tint_color_default = 'transparent'; // Default tint color 
var RestrictEOT        = true;          // Restricts !eot to only controllable players
var RestrictGmEOT      = true;          // Make GM Obey RestrictEOT (Setting true allows GM to override)

// Main loop
on("chat:message", function(msg) {
    if (msg.type != "api") return;
    var pid = msg.playerid;
    var command = msg.content.split(" ", 1);
	if (command == "!next" && playerIsGM(pid)) Next();
    if (command == "!eot") {
        var speed = parseFloat(msg.content.replace("!eot ", ""));
        EndTurn(msg.playerid,false,speed);
    }
    if(command == "!resetTint" && playerIsGM(pid)) ResetTint();
    if(command == "!clearTracker" && playerIsGM(pid)) ClearTracker();
});


function ClearTracker() {
    ResetTint();
	var turnorder = [];
	turnorder.push({
		id: "-1",
		pr: "0",
		custom: "Now Serving"
	});
	Campaign().set("turnorder", JSON.stringify(turnorder));
}


function Next() {
	var turnorder;
	
	if(Campaign().get("turnorder") == "") turnorder = [];
	else turnorder = JSON.parse(Campaign().get("turnorder"));
	// Exit if there is only 1 item in tracker
	if (turnorder.length < 2) return;
	var turnOrderSorted = [];
	// Sort items in tracker ascending
	turnOrderSorted = sortJSON(turnorder,'pr');
    // check if top item is NOT a token (second tracker)
	if (turnOrderSorted[0].id == -1){								
		// check if token after second tracker has same time, if so, move second tracker to bottom and re-sort
		if (parseFloat(turnOrderSorted[0].pr) == parseFloat(turnOrderSorted[1].pr)){
			var turn = turnOrderSorted.shift();
			turnOrderSorted.push({
			    id: turn.id,
			    pr: turn.pr,
			    custom: turn.custom
			    });
            turnOrderSorted = sortJSON(turnOrderSorted,'pr');
		}
		// otherwise, increment second, and announce in chat window when enabled
		else{
			var CurrentSecond = parseFloat(turnOrderSorted[0].pr);        
			CurrentSecond = CurrentSecond+1;
			turnOrderSorted[0].pr = CurrentSecond;
			if(AnnounceNewSecond == true) { 

  			    sendChat("", "/direct <div style='width: 100%; color: #ffffff; border: 1px solid #cc0000; background-color: #cc0000; box-shadow: 0 0 15px #800000; display: block; text-align: center; font-size: 20px; padding: 5px 0; margin-bottom: 0.25em; font-family: Garamond;'>Second " + turnorder[0].pr + "</div>");
			}
			ResetTint();
		}
	}
	Campaign().set("turnorder", JSON.stringify(turnOrderSorted));
    // Change highlight color if top item is not the second counter
	if (turnOrderSorted[0].id != -1){
		var current_token = getObj("graphic", turnOrderSorted[0].id);
		ResetTint();
		current_token.set({'tint_color' : tint_color_turn});
	}
}

function EndTurn(playerid, force, speed) {
    if(Campaign().get("turnorder") == "") return;
    if (!speed) {
        speed = 1;
    }
    var turnorder = JSON.parse(Campaign().get("turnorder"));
    if (turnorder.length < 2) return;
    
    var turn = turnorder[0];
    var id   = turn.id;
    if (id == -1) return;

    var graphic = getObj("graphic", id);

    if (force || EotRequestValid(RestrictEOT,RestrictGmEOT,playerid,graphic)) {
        var CurrentSecond = parseFloat(turn.pr);
        CurrentSecond     = CurrentSecond + speed;
        turn.pr           = CurrentSecond;
        turnorder[0].pr   = turn.pr;
 
        var turnOrderSorted = sortJSON(turnorder,'pr');
        Campaign().set("turnorder", JSON.stringify(turnorder));

        ResetTint();

        if (turnorder[0].id != -1) {
            var current_token = getObj("graphic", turnorder[0].id);
            var dump = current_token.keys;
            current_token.set({'tint_color' : tint_color_turn});
		}
	} else {
        SendChatTo(playerid, "Timer", "I don't think it's your turn.");
	}
}


// Resets the Tint value of all tokens in the Turn Order to tint_color_default
function ResetTint(){
    if (!Campaign().get('turnorder')) return;                   // Exit if the turn order tracker is not open
    var turnorder = JSON.parse(Campaign().get('turnorder'));
    if (!turnorder.length) return;
    turnorder.forEach(function(entry){                         // Reset all tint colors for current turn order list
        try{
            if(entry.id != "-1"){
                var token = getObj("graphic", entry.id);
                if(token) token.set({'tint_color' : tint_color_default}); // Reset tint value to transparent
            }
        }catch(e)
        {
            log(e);
            sendChat("GM", "/w GM Error occured in TurnHighlighter2 script func(ResetTint)");
            sendChat("GM", "/w GM " + e);
            return;
        }
    });
};




// Sort function
function sortJSON(turnorder, pr) {
    return turnorder.sort(function(a, b) {
        var x = parseFloat(a['pr']); var y = parseFloat(b['pr']);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


// Returns the requesters player._d20userid value via chat
on("chat:message", function(msg) {
    // Exit if not an api command
    if (msg.type != "api") return;
    
    // Get the API Chat Command
    var command = msg.content.split(" ", 1);
    if (command == "!getmyid") SendChatTo(msg.playerid, "GetMyId", "UserId: " + getObj("player", msg.playerid).get("_d20userid"));
});


// Returns true if the EOT Request is valid given the inputs.
// restrictEot: true: only controlling players can request, false: allows all
// restrictGmEOT: true: GMs must follow restrictEot rule, otherwise they are always valid
// playerid: playerid of the requester
// graphic: graphic object
function EotRequestValid(restrictEot, restrictGmEOT, playerid, graphic){
    return  !restrictEot ||                             // No Restrictions
            (!restrictGmEOT && playerIsGM(playerid)) || // GM Override
            (IsControlledBy(graphic, playerid));        // controlling player
};


// Send a whisper to a player using playerid
function SendChatTo(playerid, chatMsg){
    SendChatTo(playerid,"Script",chatMsg);
};


// Send a whisper to a player using a playerid with a custom source
function SendChatTo(playerid, sendAs, chatMsg){
    var player = getObj("player", playerid);
    if(player) sendChat(sendAs, "/w " + player.get("_displayname").split(" ",1) + " " + chatMsg);
};


// Returns -1 if the value is not in the array, otherwise the array index of the value
function ArraySearch(array, value){
    if(array.length <= 0) return -1;
    for(var i = 0; i < array.length; i++)    {
        if(array[i] == value) return i;
    }
    return -1;
}


// Returns an array of playerids that control the graphic
// First checks if token is a character
//     true: list of playerids that control the character
//     false: list of playerids that control the graphic e.g. graphic.controlledby
function GetControlledBy(graphic){
    var charId = graphic.get("represents");
    if(charId) return getObj("character", charId).get("controlledby").split(",");
    return graphic.get("controlledby").split(",");
};


// Returns true if "all" or playerid is a controller for the specified graphic or
// note: while the GM can control all, this does not return true for GM's playerid
//     unless GM is explicitly set or "all" is set
function IsControlledBy(graphic, playerid){
    var controllerIds = GetControlledBy(graphic);
    if(controllerIds.length <= 0) return false;
    for(var i = 0; i < controllerIds.length; i++)    {
        if(controllerIds[i] == playerid || controllerIds[i] == "all") return true;
    }
    return false;
};

