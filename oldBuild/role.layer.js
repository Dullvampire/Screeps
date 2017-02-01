var utils = require('utils');

module.exports = {
    name: 'layer',

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
        creep.pos.createConstructionSite(STRUCTURE_ROAD);

        utils.followWaypoint(creep, creep.memory.pathToFollow);
        creep.pos.createConstructionSite(STRUCTURE_ROAD);

        if (creep.memory.pathToFollow.finished) {
            creep.suicide();
        }
    },

    init: function (creep) {
        creep.memory.pathToFollow = utils.parseWaypoint(creep.name);
    }
};
