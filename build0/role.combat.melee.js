var utils = require('utils');

module.exports = {
    name: 'combat.melee',

    moreNeededNow: function (room) {
        return false;
    },

    moreNeeded: function (room) {
        return false;
    },

    getBody: function (spawn) {
        return [ATTACK, TOUGH, MOVE, MOVE];
    },

    run: function (creep) {
        if (creep.memory.mode == 0) {
            let count = 0;

            for (let creepName in Game.creeps) {
                if (Game.creeps[creepName].memory.role == 'combat.melee' && Game.creeps[creepName].memory.id == creep.memory.id) {
                    count += 1;
                }
            }

            if (Memory.battalionIds[creep.memory.id] == count) {
                creep.memory.mode = 1;
            }
        } else {
            if (creep.pos.rooomName == creep.memory.attackPosition.roomName) {
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                if (target == undefined) {
                    target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                }

                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            } else {
                var pos = creep.memory.attackPosition;
                creep.moveTo(new RoomPosition(pos.x, pos.y, pos.roomName));
            }
        }
    },

    tick: function (director) {
        return true;
    },

    init: function (creep) {
        creep.memory.mode = 0;
    }
}
