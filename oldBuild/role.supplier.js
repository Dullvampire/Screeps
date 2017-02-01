var utils = require('utils')

module.exports = {
    name: 'supplier',

    moreNeededNow: function (room) {
        return utils.countRole(this.name, room) < room.find(FIND_MY_STRUCTURES, {filter: function (a) { return a.structureType == STRUCTURE_TOWER; }}).length;
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
            if (creep.transfer(Game.getObjectById(creep.memory.sid), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.sid));
            }

            if (creep.carry.energy === 0) {
                creep.memory.mode = 0;
            }
        }
    },

    getBody: function (spawn) {
        let body = [CARRY, CARRY, MOVE, MOVE];
        return body
    },

    init: function (creep) {
        creep.memory.mode = 0;
        creep.memory.sid = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function (a) { return a.structureType == STRUCTURE_TOWER; }}).id;
    }
}
