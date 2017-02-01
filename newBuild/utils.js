module.exports = {
    distanceTo: function (pos1, pos2) {
        if (pos1.pos) {
            pos1 = pos1.pos;
        }

        if (pos2.pos) {
            pos2 = pos2.pos
        }

        var deltaX = (pos1.x - pos2.x);
        var deltaY = (pos1.y - pos2.y);

        return deltaX * deltaX + deltaY * deltaY;
    },

    getPathTo: function (pos, goals) {
        return PathFinder.search(pos, goals, { plainCost: 2, swampCost: 10, roomCallback: function(roomName) {
            let room = Game.rooms[roomName];

            if (!room) return;

            let costs = new PathFinder.CostMatrix;

            room.find(FIND_STRUCTURES).forEach(function(structure) {
                if (structure.structureType === STRUCTURE_ROAD) {
                    costs.set(structure.pos.x, structure.pos.y, 1);
                } else if (structure.structureType !== STRUCTURE_CONTAINER && (structure.structureType !== STRUCTURE_RAMPART || !structure.my)) {
                    costs.set(structure.pos.x, structure.pos.y, 0xFF);
                }
            });

            room.find(FIND_CREEPS).forEach(function(creep) {
                costs.set(creep.pos.x, creep.pos.y, 10);
            });

            return costs;
        }}).path;
    },

    travelTo: function(creep, goal) {
        if (!creep.memory.pathToFollow) {
            if (goal.pos) {
                goal = goal.pos;
            }

            var range = 0;

            if (Game.map.getTerrainAt(goal)) {
                range = 1;
            }

            creep.memory.pathToFollow = {goalPos: goal, path: Room.serializePath(this.getPathTo(creep.pos, {pos: goal, range: range}))};
        }
        if (creep.memory.pathToFollow) {
            creep.moveByPath(creep.memory.pathToFollow.path);
        }

        if (creep.pos.isEqualTo(creep.memory.pathToFollow.goalPos)) {
            delete creep.memory.pathToFollow;
        }
    }
}
