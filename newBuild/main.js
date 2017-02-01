var utils = require('utils');

module.exports.loop = function () {
    for (let c in Game.creeps) {
        utils.travelTo(Game.creeps[c], Game.creeps[c].room.controller);
    }
}
