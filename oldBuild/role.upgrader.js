var utils = require('utils');

module.exports = {
    name: 'upgrader',

    moreNeededNow: function (room) {
        return utils.countRole(this.name, room) === 0;
    },

    moreNeeded: function (room) {
        return utils.countRole(this.name, room) < Math.ceil(room.find(FIND_MY_CREEPS, {filter: function(creep) { return creep.memory.role != 'upgrader'; }}).length / 3);
    },

    getBody: function (spawn) {
        return [WORK, CARRY, MOVE, MOVE];
    },

    run: function (creep) {
        if (creep.memory.controllerPos == undefined) {
            this.init(creep);
        }
        if (creep.memory.mode === 0) {
            if (utils.harvestFromSource(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(utils.findSource(creep));
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 1;
            }
        } else {
            if (creep.upgradeController(Game.rooms[creep.memory.controllerPos.roomName].controller) == ERR_NOT_IN_RANGE) {
                let pos = new RoomPosition(creep.memory.controllerPos.x, creep.memory.controllerPos.y, creep.memory.controllerPos.roomName);
                creep.moveTo(pos);
            }

            if (creep.carry.energy === 0) {
                creep.memory.mode = 0;
            }
        }
    },

    init: function (creep) {
        creep.memory.mode = 0;

        creep.memory.controllerPos = creep.room.controller.pos;
    }
}
