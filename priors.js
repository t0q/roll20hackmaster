// Figures out a character's priors based on sex, class, and race.
// Select a character and send `!cg_priors` to run.
// --n0q
// 20200331

on("chat:message", function(msg) {
    if (msg.type != "api") return;
    var command = msg.content.split(" ", 1);
    if (command == "!cg_priors") {
	    try        { var gid = msg.selected[0]['_id']; }
	    catch(err) { sendChat("DEBUG", "ERROR: " + err); return; }

	    var gtoken = getObj('graphic', gid);
		var pid    = msg.playerid;
		if (IsControlledBy(gtoken, pid)) {
		    var cid = gtoken.get('represents');
	        table   = CreateTable();
	        setPriors(cid, table);
		}
    }
});

function CreateTable() {
    var tbl_race  = ['Dwarf',          'Elf',            'Gnome',
                     'Gnome Titan',    'Grel',           'Half-Elf',
                     'Half-Hobgoblin', 'Half-Orc',       'Halfling',
                     'Human'];
                     
    var tbl_class = ['Fighter',        'Ranger',         'Barbarian',
                     'Thief',          'Rogue',          'Assassin',
                     'Mage',           'Fighter/Mage',   'Fighter/Thief',
                     'Mage/Thief',     'Cleric'];

// Age Tables
    var tbl_age_dwarf         = {'Fighter'      : '50 + d10!p',   'Ranger'      : '70 + 3d4!p',
                                 'Barbarian'    : '40 + 4d6!p',   'Thief'       : '46 + 1d8!p',
                                 'Rogue'        : '56 + 2d8!p',   'Assassin'    : '65 + 3d6!p',
                                 'Mage'         : '72 + 4d6!p',   'Fighter/Mage': '70 + 3d6!p',
                                 'Fighter/Thief': '48 + 1d8!p',   'Mage/Thief'  : '72 + 3d6!p',
                                 'Cleric'       : '57 + 2d6!p'};

    var tbl_age_elf           = {'Fighter'      : '140 + 2d10!p', 'Ranger'      : '175 + 2d12!p',
                                 'Barbarian'    : false,          'Thief'       : '130 + 1d12!p',
                                 'Rogue'        : '160 + 1d20!p', 'Assassin'    : '180 + 3d12!p',
                                 'Mage'         : '200 + 4d12!p', 'Fighter/Mage': '200 + 2d12!p',
                                 'Fighter/Thief': '150 + 1d12!p', 'Mage/Thief'  : '190 + 3d12!p',
                                 'Cleric'       : '160 + 3d12!p'};

    var tbl_age_gnome         = {'Fighter'      : '40 + 1d8!p',   'Ranger'      : '58 + 1d8!p',
                                 'Barbarian'    : false,          'Thief'       : '37 + 1d6!p',
                                 'Rogue'        : '45 + 2d6!p',   'Assassin'    : '54 + 2d6!p',
                                 'Mage'         : '55 + 3d8!p',   'Fighter/Mage': '52 + 3d6!p',
                                 'Fighter/Thief': '44 + 1d10!p',  'Mage/Thief'  : '52 + 3d10!p',
                                 'Cleric'       : '50 + 2d6!p'};

    var tbl_age_gnometitan    = {'Fighter'      : '36 + 1d6!p',   'Ranger'      : '56 + 1d8!p',
                                 'Barbarian'    : false,          'Thief'       : '36 + 1d6!p',
                                 'Rogue'        : '46 + 2d8!p',   'Assassin'    : '50 + 2d6!p',
                                 'Mage'         : '58 + 4d6!p',   'Fighter/Mage': '52 + 3d8!p',
                                 'Fighter/Thief': '43 + 1d8!p',   'Mage/Thief'  : '52 + 3d12!p',
                                 'Cleric'       : '50 + 2d8!p'};    
    
    var tbl_age_grel          = {'Fighter'      : '28 + 1d8!p',   'Ranger'      : false,
                                 'Barbarian'    : '26 + 1d6!p',   'Thief'       : '27 + 1d6!p',
                                 'Rogue'        : false,          'Assassin'    : '33 + 1d8!p',
                                 'Mage'         : '48 + 1d12!p',  'Fighter/Mage': '44 + 1d10!p',
                                 'Fighter/Thief': '28 + 1d8!p',   'Mage/Thief'  : '45 + 1d8!p',
                                 'Cleric'       : '33 + 1d8!p'};

    var tbl_age_halfelf       = {'Fighter'      : '30 + 1d8!p',   'Ranger'      : '35 + 1d8!p',
                                 'Barbarian'    : '26 + 1d6!p',   'Thief'       : '28 + 1d6!p',
                                 'Rogue'        : '33 + 1d10!p',  'Assassin'    : '34 + 1d10!p',
                                 'Mage'         : '40 + 1d8!p',   'Fighter/Mage': '37 + 1d8!p',
                                 'Fighter/Thief': '30 + 1d8!p',   'Mage/Thief'  : '38 + 1d8!p',
                                 'Cleric'       : '34 + 1d8!p'};

    var tbl_age_halfhobgoblin = {'Fighter'      : '16 + 1d4!p',   'Ranger'      : '24 + 1d6!p',
                                 'Barbarian'    : '15 + 1d4!p',   'Thief'       : '15 + 1d3!p',
                                 'Rogue'        : '19 + 1d6!p',   'Assassin'    : '23 + 1d4!p',
                                 'Mage'         : '27 + 1d8!p',   'Fighter/Mage': '25 + 1d8!p',
                                 'Fighter/Thief': '17 + 1d4!p',   'Mage/Thief'  : '24 + 1d8!p',
                                 'Cleric'       : '22 + 1d4!p'};
    
    var tbl_age_halforc       = {'Fighter'      : '15 + 1d4!p',   'Ranger'      : '25 + 1d6!p',
                                 'Barbarian'    : '15 + 1d4!p',   'Thief'       : '15 + 1d3!p',
                                 'Rogue'        : '24 + 1d6!p',   'Assassin'    : '22 + 1d4!p',
                                 'Mage'         : '29 + 1d10!p',  'Fighter/Mage': '28 + 1d8!p',
                                 'Fighter/Thief': '16 + 1d4!p',   'Mage/Thief'  : '28 + 1d6!p',
                                 'Cleric'       : '21 + 1d4!p'};
    
    var tbl_age_halfling      = {'Fighter'      : '32 + 1d6!p',   'Ranger'      : '36 + 1d8!p',
                                 'Barbarian'    : false,          'Thief'       : '29 + 1d6!p',
                                 'Rogue'        : '32 + 1d8!p',   'Assassin'    : '34 + 1d61p',
                                 'Mage'         : '40 + 2d6!p',   'Fighter/Mage': '35 + 1d10!p',
                                 'Fighter/Thief': '33 + 1d8!p',   'Mage/Thief'  : '37 + 1d10!p',
                                 'Cleric'       : '35 + 2d4!p'};
    
    var tbl_age_human         = {'Fighter'      : '17 + 1d4!p',   'Ranger'      : '23 + 1d4!p',
                                 'Barbarian'    : '16 + 1d4!p',   'Thief'       : '16 + 1d3!p', 
                                 'Rogue'        : '19 + 1d4!p',   'Assassin'    : '24 + 1d4!p',
                                 'Mage'         : '25 + 1d6!p',   'Fighter/Mage': '24 + 1d6!p',
                                 'Fighter/Thief': '18 + 1d4!p',   'Mage/Thief'  : '23 + 1d6!p', 
                                 'Cleric'       : '20 + 1d4!p'};
    
    var vals_age = [tbl_age_dwarf,         tbl_age_elf,     tbl_age_gnome,
                    tbl_age_gnometitan,    tbl_age_grel,    tbl_age_halfelf,
                    tbl_age_halfhobgoblin, tbl_age_halforc, tbl_age_halfling,
                    tbl_age_human];
    
    var tbl_age = {};
    tbl_race.forEach((key, val) => tbl_age[key] = vals_age[val]);
    
// Height Tables
    var tbl_height_dwarf = [{'max':   2, 'Female': '48 - 1d4', 'Male': '50 - 1d4'},
                            {'max':   6, 'Female': 48,         'Male': 50},
                            {'max':  12, 'Female': 49,         'Male': 51},
                            {'max':  22, 'Female': 50,         'Male': 52},
                            {'max':  37, 'Female': 51,         'Male': 53},
                            {'max':  58, 'Female': 52,         'Male': 54},
                            {'max':  75, 'Female': 53,         'Male': 55},
                            {'max':  84, 'Female': 54,         'Male': 56},
                            {'max':  91, 'Female': 55,         'Male': 57},
                            {'max':  96, 'Female': 56,         'Male': 58},
                            {'max': 100, 'Female': '54 + 1d4', 'Male': '56 + 1d4'}];

    var tbl_height_elf = [{'max':   1, 'Female': '57 - 1d3', 'Male': '62 - 1d3'},
                          {'max':   4, 'Female': 57,         'Male': 62},
                          {'max':  10, 'Female': 58,         'Male': 63},
                          {'max':  19, 'Female': 59,         'Male': 64},
                          {'max':  34, 'Female': 60,         'Male': 65},
                          {'max':  62, 'Female': 61,         'Male': 66},
                          {'max':  79, 'Female': 62,         'Male': 67},
                          {'max':  90, 'Female': 63,         'Male': 68},
                          {'max':  96, 'Female': 64,         'Male': 69},
                          {'max':  99, 'Female': 65,         'Male': 70},
                          {'max': 100, 'Female': '64 + 1d3', 'Male': '69 + 1d3'}];
    
    var tbl_height_gnome = [{'max':   5, 'height': 36, 'Male': 38},
                            {'max':  17, 'height': 37, 'Male': 39},
                            {'max':  33, 'height': 38, 'Male': 40},
                            {'max':  54, 'height': 39, 'Male': 41},
                            {'max':  71, 'height': 40, 'Male': 42},
                            {'max':  83, 'height': 41, 'Male': 43},
                            {'max':  93, 'height': 42, 'Male': 44},
                            {'max':  98, 'height': 43, 'Male': 45},
                            {'max': 100, 'height': 44, 'Male': 46}];

    var tbl_height_gnometitan = [{'max':   5, 'Female': 34, 'Male': 35},
                                 {'max':  17, 'Female': 35, 'Male': 36},
                                 {'max':  33, 'Female': 36, 'Male': 37},
                                 {'max':  54, 'Female': 37, 'Male': 38},
                                 {'max':  71, 'Female': 38, 'Male': 39},
                                 {'max':  83, 'Female': 39, 'Male': 40},
                                 {'max':  93, 'Female': 40, 'Male': 41},
                                 {'max': 100, 'Female': 41, 'Male': 42}];

    var tbl_height_grel = [{'max':   4, 'Female': '63 - 1d3', 'Male': '66 + 1d3'},
                           {'max':  10, 'Female': 63,         'Male': 66},
                           {'max':  19, 'Female': 64,         'Male': 67},
                           {'max':  34, 'Female': 65,         'Male': 68},
                           {'max':  62, 'Female': 66,         'Male': 69},
                           {'max':  79, 'Female': 67,         'Male': 70},
                           {'max':  90, 'Female': 68,         'Male': 71},
                           {'max':  96, 'Female': 69,         'Male': 72},
                           {'max':  99, 'Female': 70,         'Male': 73},
                           {'max': 100, 'Female': '69 + 1d3', 'Male': '72 + 1d4'}];
    
    var tbl_height_halfelf = [{'max':   3, 'Female': '61 - 1d6', 'Male': '65 - 1d6'},
                              {'max':   7, 'Female': 59,         'Male': 63},
                              {'max':  13, 'Female': 60,         'Male': 64},
                              {'max':  20, 'Female': 61,         'Male': 65},
                              {'max':  29, 'Female': 62,         'Male': 66},
                              {'max':  41, 'Female': 63,         'Male': 67},
                              {'max':  61, 'Female': 64,         'Male': 68},
                              {'max':  75, 'Female': 65,         'Male': 69},
                              {'max':  85, 'Female': 66,         'Male': 70},
                              {'max':  91, 'Female': 67,         'Male': 71},
                              {'max':  96, 'Female': 68,         'Male': 72},
                              {'max':  99, 'Female': 69,         'Male': 73},
                              {'max': 100, 'Female': '66 + 1d6', 'Male': '70 + 1d6'}];

    var tbl_height_halforc = [{'max':   2, 'Female': '57 - 1d3', 'Male': '62 - 1d3'},
                              {'max':   7, 'Female': 57,         'Male': 62},
                              {'max':  14, 'Female': 58,         'Male': 63},
                              {'max':  26, 'Female': 59,         'Male': 64},
                              {'max':  42, 'Female': 60,         'Male': 65},
                              {'max':  63, 'Female': 61,         'Male': 66},
                              {'max':  78, 'Female': 62,         'Male': 67},
                              {'max':  88, 'Female': 63,         'Male': 68},
                              {'max':  96, 'Female': 64,         'Male': 69},
                              {'max': 100, 'Female': '63 + 1d4', 'Male': '67 + 1d6'}];

    var tbl_height_halfhobgoblin = [{'max':   2, 'Female': '60 - 1d4', 'Male': '68 - 1d4'},
                                    {'max':   6, 'Female': 60,         'Male': 68},
                                    {'max':  15, 'Female': 61,         'Male': 69},
                                    {'max':  27, 'Female': 62,         'Male': 70},
                                    {'max':  42, 'Female': 63,         'Male': 71},
                                    {'max':  60, 'Female': 64,         'Male': 72},
                                    {'max':  75, 'Female': 65,         'Male': 73},
                                    {'max':  87, 'Female': 66,         'Male': 74},
                                    {'max':  96, 'Female': 67,         'Male': 75},
                                    {'max': 100, 'Female': '65 + 1d4', 'Male': '73 + 1d6'}];

    var tbl_height_halfling = [{'max':   6, 'Female': '38 + 1d3', 'Male': '40 - 1d3'},
                               {'max':  12, 'Female': 38,         'Male': 40},
                               {'max':  22, 'Female': 39,         'Male': 41},
                               {'max':  37, 'Female': 40,         'Male': 42},
                               {'max':  58, 'Female': 41,         'Male': 43},
                               {'max':  75, 'Female': 42,         'Male': 44},
                               {'max':  84, 'Female': 43,         'Male': 45},
                               {'max':  91, 'Female': 44,         'Male': 46},
                               {'max':  96, 'Female': 45,         'Male': 47},
                               {'max': 100, 'Female': '44 + 1d3', 'Male': '46 + 1d3'}];

    var tbl_height_human = [{'max':   1, 'Female': '62 - 1d10', 'Male': '66 - 1d10'},
                            {'max':   3, 'Female': 60,          'Male': 64},
                            {'max':   5, 'Female': 61,          'Male': 65},
                            {'max':  12, 'Female': 62,          'Male': 66},
                            {'max':  20, 'Female': 63,          'Male': 67},
                            {'max':  29, 'Female': 64,          'Male': 68},
                            {'max':  41, 'Female': 65,          'Male': 69},
                            {'max':  61, 'Female': 66,          'Male': 70},
                            {'max':  75, 'Female': 67,          'Male': 71},
                            {'max':  85, 'Female': 68,          'Male': 72},
                            {'max':  91, 'Female': 69,          'Male': 73},
                            {'max':  96, 'Female': 70,          'Male': 74},
                            {'max':  98, 'Female': 71,          'Male': 75},
                            {'max':  99, 'Female': 72,          'Male': 76},
                            {'max': 100, 'Female': '68 + 1d8',  'Male': '73 + 1d10'}];

    var vals_height = [tbl_height_dwarf,         tbl_height_elf,     tbl_height_gnome,
                       tbl_height_gnometitan,    tbl_height_grel,    tbl_height_halfelf,
                       tbl_height_halfhobgoblin, tbl_height_halforc, tbl_height_halfling,
                       tbl_height_human];

    var tbl_height = {};
    tbl_race.forEach((key, val) => tbl_height[key] = vals_height[val]);

// BMI Tables
    var tbl_bmi_dwarf = [{'max':  1, 'Female': 34,         'Male': 34},
                         {'max':  2, 'Female': 35,         'Male': 35},
                         {'max':  4, 'Female': 36,         'Male': 36},
                         {'max':  6, 'Female': 37,         'Male': 37},
                         {'max':  8, 'Female': 38,         'Male': 38},
                         {'max': 12, 'Female': 38.5,       'Male': 38.5},
                         {'max': 14, 'Female': 41,         'Male': 41},
                         {'max': 15, 'Female': 44,         'Male': 44},
                         {'max': 16, 'Female': 46,         'Male': 46},
                         {'max': 17, 'Female': 48,         'Male': 48},
                         {'max': 18, 'Female': 50,         'Male': 50},
                         {'max': 19, 'Female': 53.5,       'Male': 53.5},
                         {'max': 20, 'Female': '53 + 1d6', 'Male': '53 + 1d6'}];
 
    var tbl_bmi_elf = [{'max': 1, 'Female': 16, 'Male': 16.5},
                       {'max': 2, 'Female': 17, 'Male': 17.5},
                       {'max': 4, 'Female': 18, 'Male': 18.5},
                       {'max': 5, 'Female': 19, 'Male': 19.5},
                       {'max': 6, 'Female': 20, 'Male': 20.5}];

    var tbl_bmi_gnome = [{'max':  1, 'Female': 28.5, 'Male': 29},
                         {'max':  3, 'Female': 29.5, 'Male': 30},
                         {'max':  6, 'Female': 30.5, 'Male': 31},
                         {'max':  9, 'Female': 31.5, 'Male': 32},
                         {'max': 11, 'Female': 32.5, 'Male': 33},
                         {'max': 13, 'Female': 33.5, 'Male': 34},
                         {'max': 15, 'Female': 34.5, 'Male': 35},
                         {'max': 17, 'Female': 35.5, 'Male': 36},
                         {'max': 19, 'Female': 36.5, 'Male': 37},
                         {'max': 20, 'Female': 37.5, 'Male': 38}];

    var tbl_bmi_gnometitan = [{'max':  1, 'Female': 28.5, 'Male': 28.5},
                              {'max':  2, 'Female': 29.5, 'Male': 29.5},
                              {'max':  4, 'Female': 30,   'Male': 30},
                              {'max':  7, 'Female': 31,   'Male': 31},
                              {'max': 11, 'Female': 32,   'Male': 32},
                              {'max': 14, 'Female': 33,   'Male': 33},
                              {'max': 17, 'Female': 34,   'Male': 34},
                              {'max': 19, 'Female': 35,   'Male': 35},
                              {'max': 20, 'Female': 37,   'Male': 37}];

    var tbl_bmi_grel = [{'max':  2, 'Female': 18, 'Male': 19},
                        {'max':  4, 'Female': 19, 'Male': 20},
                        {'max':  8, 'Female': 20, 'Male': 21},
                        {'max': 11, 'Female': 21, 'Male': 22},
                        {'max': 12, 'Female': 22, 'Male': 23}];

    var tbl_bmi_halfelf = [{'max':  2, 'Female': 16,   'Male': 17},
                           {'max':  5, 'Female': 17,   'Male': 18},
                           {'max': 10, 'Female': 18,   'Male': 19.5},
                           {'max': 14, 'Female': 19,   'Male': 20.5},
                           {'max': 16, 'Female': 20.5, 'Male': 22},
                           {'max': 19, 'Female': 21.5, 'Male': 23},
                           {'max': 20, 'Female': 22.5, 'Male': 24}];

    var tbl_bmi_halfhobgoblin = [{'max':  1, 'Female': 20,         'Male': 20.5},
                                 {'max':  2, 'Female': 20.5,       'Male': 21.5},
                                 {'max':  4, 'Female': 21,         'Male': 23},
                                 {'max':  8, 'Female': 22,         'Male': 24},
                                 {'max': 12, 'Female': 23,         'Male': 24.5},
                                 {'max': 14, 'Female': 24,         'Male': 25},
                                 {'max': 16, 'Female': 25,         'Male': 26},
                                 {'max': 17, 'Female': 26,         'Male': 26.5},
                                 {'max': 18, 'Female': 27,         'Male': 27.5},
                                 {'max': 19, 'Female': 28,         'Male': 29},
                                 {'max': 20, 'Female': '29 + 1d4', 'Male': '31 + 1d6'}];

    var tbl_bmi_halforc = [{'max':  1, 'Female': 20,         'Male': 24},
                           {'max':  2, 'Female': 22,         'Male': 25},
                           {'max':  4, 'Female': 24,         'Male': 26},
                           {'max':  6, 'Female': 26,         'Male': 27},
                           {'max':  8, 'Female': 27,         'Male': 28},
                           {'max': 10, 'Female': 28,         'Male': 29},
                           {'max': 14, 'Female': 29,         'Male': 30},
                           {'max': 16, 'Female': 30,         'Male': 31},
                           {'max': 18, 'Female': 32,         'Male': 33},
                           {'max': 20, 'Female': '33 + 1d4', 'Male': '34 + 1d6'}];

    var tbl_bmi_halfling = [{'max':  1, 'Female': 29,         'Male': 30},
                            {'max':  2, 'Female': 30,         'Male': 31},
                            {'max':  3, 'Female': 31,         'Male': 32},
                            {'max':  5, 'Female': 32,         'Male': 33},
                            {'max':  7, 'Female': 33,         'Male': 34},
                            {'max': 10, 'Female': 34,         'Male': 35},
                            {'max': 14, 'Female': 35,         'Male': 36},
                            {'max': 16, 'Female': 37,         'Male': 38},
                            {'max': 17, 'Female': 40,         'Male': 41},
                            {'max': 18, 'Female': 42,         'Male': 43},
                            {'max': 19, 'Female': 44,         'Male': 45.5},
                            {'max': 20, 'Female': '44 + 1d4', 'Male': '45 + 1d6'}];

    var tbl_bmi_human = [{'max':  1, 'Female': 17,   'Male': 17.5},
                         {'max':  2, 'Female': 17.5, 'Male': 18},
                         {'max':  3, 'Female': 18.5, 'Male': 19},
                         {'max':  5, 'Female': 19.5, 'Male': 20},
                         {'max':  8, 'Female': 20.5, 'Male': 21},
                         {'max': 11, 'Female': 21.5, 'Male': 22},
                         {'max': 14, 'Female': 22.5, 'Male': 23},
                         {'max': 15, 'Female': 23.5, 'Male': 24},
                         {'max': 16, 'Female': 24.5, 'Male': 25},
                         {'max': 17, 'Female': 25.5, 'Male': 26},
                         {'max': 18, 'Female': 27.5, 'Male': 28},
                         {'max': 19, 'Female': 29.5, 'Male': 30},
                         {'max': 20, 'Female': '29 + 1d4!p', 'Male': '30 + 1d4!p'}];

    var vals_bmi = [tbl_bmi_dwarf,         tbl_bmi_elf,     tbl_bmi_gnome,
                    tbl_bmi_gnometitan,    tbl_bmi_grel,    tbl_bmi_halfelf,
                    tbl_bmi_halfhobgoblin, tbl_bmi_halforc, tbl_bmi_halfling,
                    tbl_bmi_human];

    var tbl_bmi = {};
    tbl_race.forEach((key, val) => tbl_bmi[key] = vals_bmi[val]);

// Handedness Tables
    var tbl_hand_common = [{'max':  90, 'hand': 'Right'},
                           {'max':  99, 'hand': 'Left'},
                           {'max': 100, 'hand': 'Ambidextrous'}];

    var tbl_hand_elves = [{'max':  75, 'hand': 'Right'},
                          {'max':  90, 'hand': 'Left'},
                          {'max': 100, 'hand': 'Ambidextrous'}];

    var tbl_hand_halforc = [{'max':  20, 'hand': 'Right'},
                            {'max': 100, 'hand': 'Left'}];

    var vals_hand = [tbl_hand_common, tbl_hand_elves,   tbl_hand_common,
                     tbl_hand_common, tbl_hand_common,  tbl_hand_elves,
                     tbl_hand_common, tbl_hand_halforc, tbl_hand_common,
                     tbl_hand_common];

    var tbl_hand = {};
    tbl_race.forEach((key, val) => tbl_hand[key] = vals_hand[val]);

// Legitimacy Tables
    var tbl_legit_20 = [{'max':  1, 'legitimate': true}];
    
    var tbl_legit_19 = [{'max': 19, 'legitimate': true},
                        {'max': 20, 'legitimate': false}];

    var tbl_legit_18 = [{'max':  9, 'legitimate': true},
                        {'max': 10, 'legitimate': false}];    

    var tbl_legit_1  = [{'max':  1, 'legitimate': true},
                        {'max': 20, 'legitimate': false}]; 

    var tbl_legit_0  = [{'max':  1, 'legitimate': false}];

    var vals_legit = [tbl_legit_20, tbl_legit_20, tbl_legit_19,
                      tbl_legit_18, tbl_legit_20, tbl_legit_19,
                      tbl_legit_1,  tbl_legit_0,  tbl_legit_19,
                      tbl_legit_18];

    var tbl_legit = {};
    tbl_race.forEach((key, val) => tbl_legit[key] = vals_legit[val]);
    
// Sibling Table
    var tab_numsiblings = [{'max':  1, 'num': 0},
                           {'max':  2, 'num': 1},
                           {'max':  5, 'num': 2},
                           {'max':  8, 'num': 3},
                           {'max': 12, 'num': 4},
                           {'max': 15, 'num': 5},
                           {'max': 18, 'num': 6},
                           {'max': 19, 'num': 7},
                           {'max': 20, 'num': 8}];
    
    var table    = {};
    table.age    = tbl_age;
    table.height = tbl_height;
    table.bmi    = tbl_bmi;
    table.hand   = tbl_hand;
    table.legit  = tbl_legit;
    return table;
}

function setPriors(cid, table) {

    var params  = getParameters(cid);
    var age     = table.age[params.race][params.class];
    var height  = rollTable(table.height[params.race]);
    var bmi     = rollTable(table.bmi[params.race]);
    var handed  = rollTable(table.hand[params.race])['hand'];
    var b_legit = rollTable(table.legit[params.race])['legitimate'];

    if (b_legit) {
        var lineage = "Legitimate";
    } else {
        var lineage = "Bastard";
    }

    var card = "&{template:default} "                    +
               "{{name="            + "Priors for " + params.name +
               "}}{{handedness="    + handed             +
               "}}{{lineage="       + lineage            +
               "}}{{age="    + "[[" + age                + "]]"   +
               "}}{{height=" + "[[" + height[params.sex] + "]]"   +
               "}}{{BMI="    + "[[" + bmi[params.sex]    + "]]"   +
               "}}";
    sendChat("AutoGM", card); 
}

function rollTable(table) {
    var max_roll = table[table.length -1].max;
    var roll     = randomInteger(max_roll);
    for (var idx = 0; idx < table.length; idx++) {
        if (roll <= table[idx].max) {
            break;
        }
    }
    return table[idx];
}

function setAttribute(cid, key, value) {
    var atoken = findObjs({type: 'attribute', characterid: cid, name: key})[0];
    if (atoken) {
        atoken.set('current', value);
    } else {
        createObj('attribute', {name: key, current: value, characterid: cid});
    }
}

function getParameters(cid) {
    var params   = {};

    var raw_sex  = getAttrByName(cid, "sex");
    params.sex   = raw_sex[0].toUpperCase() + raw_sex.slice(1);
    params.class = getAttrByName(cid, "class");
    params.race  = getAttrByName(cid, "race");
    var ctoken   = getObj('character', cid);
    params.name  = ctoken.get('name');
    return params;
}

function GetControlledBy(graphic) {
    var charId = graphic.get("represents");
    if (charId) return getObj("character", charId).get("controlledby").split(",");
    return graphic.get("controlledby").split(",");
};

function IsControlledBy(graphic, playerid) {
    var controllerIds = GetControlledBy(graphic);
    if (controllerIds.length <= 0) return false;
    for (var i = 0; i < controllerIds.length; i++) {
        if (controllerIds[i] == playerid || controllerIds[i] == "all") return true;
    }
    return false;
};
