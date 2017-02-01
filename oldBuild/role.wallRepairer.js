var utils = require('utils');

module.exports = {
    name: 'wallRepairer',

    moreNeededNow: function (room) {
        return utils.countRole(this.name, room) === 0;
    },

    moreNeeded: function (room) {
        return utils.countRole(this.name, room) < Math.ceil(room.find(FIND_STRUCTURES, {filter: function(s) { return s.structureType == STRUCTURE_WALL; }}).length / 10);
    },

    getBody: function (spawn) {
        return [WORK, CARRY, MOVE];
    },

    run: function (creep) {
        if (creep.memory.mode === 0) {
            if (utils.harvestFromSource(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(utils.findSource(creep));
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 1;
                creep.say('repairing');
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {filter: function (a) {
                return a.structureType == STRUCTURE_WALL && a.hits < a.hitsMax;
            }});

            targets = targets.sort(function (a, b) {
                return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
            });

            var target = targets[0];

            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

            if (creep.carry.energy === 0) {
                creep.memory.mode = 0;
            }
        }
    },

    init: function (creep) {
        creep.memory.mode = 0;
    }
}
