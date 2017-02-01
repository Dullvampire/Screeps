var utils = require('utils')

module.exports = {
    name: 'harvester',

    moreNeededNow: function (room) {
        return utils.countRole(this.name, room) === 0;
    },

    moreNeeded: function (room) {
        return utils.countRole(this.name, room) < this.findOpenSpotsInRoom(room).length;
    },

    getBody: function (spawn) {
        let changed = false;
        let body = [WORK, WORK, WORK, WORK, CARRY, MOVE];

        while (spawn.canCreateCreep(body) !== 0) {
            body.shift();
        }

        if (body.length <= 2) {
            return [];
        }

         return body;
    },

    enough: function () {
        return true;
    },

    run: function (creep) {
        if (creep.memory.spot == undefined) {
            this.init(creep);
        }

        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(Game.getObjectById(creep.memory.sid)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.spot.x, creep.memory.spot.y)
            }
        } else {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s) { return s.structureType == STRUCTURE_CONTAINER; }});

            if (container == undefined || creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.drop(RESOURCE_ENERGY);
            }
        }

        var nearby = creep.pos.findInRange(FIND_STRUCTURES, 1).concat(creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1));

        let oneNearby = false;

        for (let i in nearby) {
            if (nearby[i].structureType == STRUCTURE_CONTAINER) {
                oneNearby = true;
            }
        }

        if (!oneNearby && !Memory.contMadeToday && creep.pos.getRangeTo(creep.pos.findClosestByRange(FIND_SOURCES)) <= 1) {
            Memory.contMadeToday = true;
            creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
        }
    },

    init: function (creep) {
        let open = this.findOpenSpots(creep);
        for (let i in open) {
            let flags = open[i].lookFor(LOOK_FLAGS);
            var flagCount = 0;

            for (let flag in flags) {
                if (flags[flag].color == COLOR_RED) {
                    flagCount ++;
                }
            }

            if (flagCount === 0) {
                creep.memory.spot = open[i];
                creep.memory.sid = open[i].findClosestByRange(FIND_SOURCES).id;
                creep.room.createFlag(open[i], creep.name, COLOR_RED)
                break;
            }
        }
    },

    findOpenSpotsInRoom: function (room) {
        let sources = room.find(FIND_SOURCES);

        let open = [];

        for (let s in sources) {
            let source = sources[s];
            let x = source.pos.x;
            let y = source.pos.y;

            for (let dx = -1; dx <= 1; dx ++) {
                for (let dy = -1; dy <= 1; dy ++) {
                    if (Math.abs(dx) + Math.abs(dy) > 0) {
                        let pos = new RoomPosition(x + dx, y + dy, room.name);

                        if (Game.map.getTerrainAt(pos) != 'wall') {
                            open.push(pos);
                        }
                    }
                }
            }
        }

        return open;
    },

    findOpenSpots: function (creep) {
        let open = this.findOpenSpotsInRoom(creep.room);
        open = open.sort(function (a, b) {
            return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b)
        });

        return open;
    },

    tick: function (director) {
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            let flags = room.find(FIND_FLAGS);
            for (let flagName in flags) {
                let flag = flags[flagName];
                if (flag.color == COLOR_RED && Game.creeps[flag.name] == undefined) {
                    flag.remove();
                }
            }
        }

        Memory.contMadeToday = false;
    }
}
