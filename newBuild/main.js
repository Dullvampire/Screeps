var utils = require('utils');

module.exports.loop = function () {
    for (let c in Memory.creeps) {
        if (!Game.creeps[c]) {
            delete Memory.creeps[c];
        }
    }

    for (let c in Game.creeps) {
        utils.travelTo(Game.creeps[c], Game.creeps[c].room.controller);
    }
}
