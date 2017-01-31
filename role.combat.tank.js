var utils = require('utils');

module.exports = {
    name: 'combat.tank',

    moreNeededNow: function (room) {
        return false;
    },

    moreNeeded: function (room) {
        return false;
    },

    getBody: function (spawn) {
        let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE];

        return body;
    },

    run: function (creep) {
        if (creep.memory.mode == 0) {
            let count = 0;

            for (let creepName in Game.creeps) {
                if ((Game.creeps[creepName].memory.role == 'combat.melee' || Game.creeps[creepName].memory.role == 'combat.tank') && Game.creeps[creepName].memory.id == creep.memory.id) {
                    count += 1;
                }
            }

            if (Memory.battalionIds[creep.memory.id] == count) {
                creep.memory.mode = 1;
            }
        } else {
            var pos = creep.memory.attackPosition;
            creep.moveTo(new RoomPosition(pos.x, pos.y, pos.roomName));
        }

        creep.say(creep.hits + '/' + creep.hitsMax + ' hp');
    },

    tick: function (director) {
        return true;
    },

    init: function (creep) {
        creep.memory.mode = 0;
    }
}
