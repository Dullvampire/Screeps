var utils = require('utils');

module.exports = {
    name: 'transporter',

    moreNeededNow: function (room) {
        return utils.countRole(this.name, room) === 0;
    },

    moreNeeded: function (room) {
        return utils.countRole(this.name, room) < room.find(FIND_SOURCES).length;
    },

    getBody: function (spawn) {
        let body = [CARRY, MOVE];

        body = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];

        while(spawn.canCreateCreep(body) !== 0) {
            body.shift();
        }

        if (body.length <= 2) {
            return [];
        }

        return body
    },

    run: function (creep) {
        if (creep.memory.source == undefined) {
            this.init(creep);
        }

        if (creep.memory.mode === 0) {
            if (creep.pos.inRangeTo(creep.memory.source.x, creep.memory.source.y, 5)) {
                creep.memory.mode = 1;
            } else {
                creep.moveTo(creep.memory.source.x, creep.memory.source.y);
            }
        } else if (creep.memory.mode == 1) {
            let ret = utils.harvestFromSource(creep);
            if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(utils.findSource(creep));
            } else if (ret === false) {
                creep.moveTo(Game.flags[creep.name]);
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 2;
            }
        } else {
            if (creep.transfer(this.findEmptyTarget(creep), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(this.findEmptyTarget(creep));
            }

            if (creep.carry.energy === 0) {
                creep.memory.mode = 0;
            }
        }

        creep.say(creep.carry.energy + '/' + creep.carryCapacity);
    },

    findEmptyTarget: function (creep) {
        return creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (a) {
            return (a.structureType == STRUCTURE_SPAWN || a.structureType == STRUCTURE_EXTENSION) && a.energy < a.energyCapacity;
        }})
    },

    init: function (creep) {
        creep.memory.mode = 0;

        let sources = new Array();

        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];

            sources = sources.concat(room.find(FIND_SOURCES));
        }

        sources = sources.sort(function (a, b) {
            return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
        });
        sources = _.filter(sources, function (s) {
            let flags = s.pos.lookFor(LOOK_FLAGS);
            for (let flagIndex in flags) {
                let flag = flags[flagIndex];

                if (flag.color == COLOR_RED && flag.secondaryColor == COLOR_BLUE) {
                    return false;
                }
            }

            return true;
        });

        let source = sources[0];

        if (source == undefined) {
            source = creep.pos.findClosestByRange(FIND_SOURCES);
        }

        source.room.createFlag(source.pos.x, source.pos.y, creep.name, COLOR_RED, COLOR_BLUE);
        creep.memory.source = source.pos;
    }
}
