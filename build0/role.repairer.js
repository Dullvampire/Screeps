var utils = require('utils');

module.exports = {
    name: 'repairer',

    moreNeededNow: function (room) {
        return utils.countRole(this.name, room) === 0;
    },

    moreNeeded: function (room) {
        return utils.countRole(this.name, room) < Math.ceil(room.find(FIND_STRUCTURES).length / 10);
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
                creep.say('repairing');
            }
        } else {
            if (Memory.repCpu == undefined) {
                Memory.repCpu = [0, 0];
            }

            var t = Game.cpu.getUsed();
            var targets = creep.room.find(FIND_STRUCTURES, {filter: function (a) {
                return a.structureType != STRUCTURE_WALL && a.hits < a.hitsMax;
            }});
            Memory.repCpu[0] += Game.cpu.getUsed() - t;

            targets = targets.sort(function (a, b) {
                return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
            });
            Memory.repCpu[1] += Game.cpu.getUsed() - t;
            t = Game.cpu.getUsed();

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
