var utils = require('utils');

module.exports = {
    name: 'builder',

    moreNeededNow: function (room) {
        var cSites = this.getAllCSites();
        return utils.countRole(this.name) === 0 && cSites.length > 1;
    },

    moreNeeded: function (room) {
        var cSites = this.getAllCSites();
        return utils.countRole(this.name) < Math.ceil(cSites.length / 10);
    },

    getAllCSites: function () {
        var cSites = [];
        for (var c in Game.constructionSites) {
            cSites.push(Game.constructionSites[c]);
        }

        return cSites;
    },

    getBody: function (spawn) {
        let body = [WORK, CARRY, MOVE, MOVE];

        return body;
    },

    run: function (creep) {
        if (creep.memory.mode === 0) {
            if (utils.harvestFromSource(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(utils.findSource(creep));
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 1;
            }
        } else {
            var cSites = this.getAllCSites();

            var closest = creep.pos.findClosestByRange(cSites);

            if (creep.build(closest) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }

            if (creep.carry.energy === 0) {
                creep.memory.mode = 0;
            }
        }
    }
}
