var utils = require('utils');

module.exports = {
    name: 'explorer',

    moreNeededNow: function (room) {
        return false;
    },

    moreNeeded: function (room) {
        return false;
    },

    getBody: function (spawn) {
        return [MOVE];
    },

    run: function (creep) {
        if (creep.memory.route == undefined) {
            var flag = Game.flags[creep.name];

            if (flag != undefined && flag.color == COLOR_YELLOW) {
                creep.moveTo(flag);
            }
        } else {
            utils.followWaypoint(creep, creep.memory.route);
        }
    },

    tick: function (director) {
        for (let flagName in Game.flags) {
            let flag = Game.flags[flagName];

            if (flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_WHITE) {
                utils.addToQueue('explorer', flagName);
                flag.setColor(COLOR_YELLOW, COLOR_YELLOW);
            }
        }
    }
}
