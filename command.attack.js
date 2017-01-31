var utils = require('utils');

module.exports = function (attackFlag, melee, tank) {
    var pos = Game.flags[attackFlag].pos;
    var id = Math.random();

    Memory.battalionIds[id] = melee + tank;

    for (var i = 0; i < melee; i ++) {
        utils.addToQueue('combat.melee', '', {id: id, attackPosition: pos})
    }

    for (var i = 0; i < tank; i ++) {
        utils.addToQueue('combat.tank', '', {id: id, attackPosition: pos})
    }
}
