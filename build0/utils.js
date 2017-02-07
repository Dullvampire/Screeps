var extend = require('extend');

module.exports = {
    spawnCreep: function (spawn, body, role, name, memory) {
        if (name == undefined) {
            name = '';
        }
        if (memory == undefined) {
            memory = {};
        }

        var r = spawn.createCreep(body, name, extend({role: role.name, initialized: false}, memory));
        return r;
    },

    countRole: function (role, room) {
        if (room == undefined) {
            var creeps = Game.creeps;
        } else {
            var creeps = room.find(FIND_MY_CREEPS);
        }
        var i = 0;

        for (var creep in creeps) {
            if (creeps[creep].memory.role == role) {
                i ++;
            }
        }

        return i;
    },

    findSource: function (creep) {

        var possible = creep.room.find(FIND_STRUCTURES, {filter: function (s) { return s.structureType == STRUCTURE_CONTAINER && s.store.energy != 0; }}).concat(creep.room.find(FIND_DROPPED_ENERGY));
        var container = creep.pos.findClosestByRange(possible);
        if (container !== undefined) {
            return container;
        } else {
            let container = creep.pos.findClosestByRange(possible);
            if (container !== undefined) {
                return container;
            }
        }
    },

    harvestFromSource: function (creep) {
        var s = this.findSource(creep);

        if (s !== undefined && s !== null) {
            if (s.structureType == STRUCTURE_CONTAINER) {
                return creep.withdraw(s, RESOURCE_ENERGY);
            } else {
                return creep.pickup(s);
            }
        }

        return false;
    },

    getEnergy: function(spawn) {
        let energy = spawn.energy;
        let extensions = spawn.room.find(FIND_STRUCTURES, {filter: function (structure) {
            return structure.structureType == STRUCTURE_EXTENSION;
        }});

        for (let e in extensions) {
            energy += extensions[e].energy;
        }

        return energy;
    },

    getCapacity: function(spawn) {
        let energy = spawn.energyCapacity;
        let extensions = spawn.room.find(FIND_STRUCTURES, {filter: function (structure) {
            return structure.structureType == STRUCTURE_EXTENSION;
        }});

        for (let e in extensions) {
            energy += extensions[e].energyCapacity;
        }

        return energy;
    },

    addToQueue: function (role, name, memory) {
        if (name == undefined) {
            name = '';
        }

        if (memory == undefined) {
            memory = {}
        }

        Memory.productionQueue.push({name: name, role: role, finished: false, memory: memory});
    },

    parseWaypoint: function (name) {
        var endBehaviors = ['stop', 'loop', 'reverse'];

        var path = {index: 0, dIndex: 1, points: []};

        path.points.push(Game.flags[name].pos);

        var morePoints = true;
        var i = 0;

        while (morePoints) {
            try {
                path.points.push(Game.flags[name + '.' + i.toString()].pos);
                i ++;
            } catch (e) {
                morePoints = false;
            }
        }

        for (let i in endBehaviors) {
            try {
                path.points.push(Game.flags[name + '.' + endBehaviors[i]].pos);
                path.endBehavior = endBehaviors[i];
            } catch (e) {

            }
        }

        return path;
    },

    followWaypoint: function (creep, path) {
        var nextPoint = path.points[path.index];

        if (creep.pos.x == nextPoint.x && creep.pos.y == nextPoint.y) {
            path.index += path.dIndex;
        }

        if (path.index == path.points.length && path.dIndex > 0 && path.endBehavior == 'reverse') {
            path.dIndex = -1;
        }

        if (path.index === 0 && path.dIndex < 0 && path.endBehavior == 'reverse') {
            path.dIndex = 1;
        }

        if (path.index == path.points.length && path.endBehavior == 'loop') {
            path.index = 0;
        }

        if (path.index == path.points.length && path.endBehavior == 'stop') {
            path.dIndex = 0;
            path.index = path.points.length - 1;
            path.finished = true;
        }

        var nextPoint = path.points[path.index];
        creep.moveTo(new RoomPosition(nextPoint.x, nextPoint.y, nextPoint.roomName));
    },

    findAll: function (findConst, filter) {
        if (filter === undefined) {
            filter = function (a) { return true; }
        }

        var found = [];

        for (let roomName in Game.rooms) {
            found = found.concat(Game.rooms[roomName].find(findConst, {filter: filter}));
        }

        return found;
    },

    findClosestInAll: function (creep, findConst, filter) {
        if (filter === undefined) {
            filter = function (a) { return true; }
        }

        var found = [];

        for (let roomName in Game.rooms) {
            found = found.concat(Game.rooms[roomName].find(findConst, {filter: filter}));
        }

        return creep.findClosestByRange(found);
    }
};
