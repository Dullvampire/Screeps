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
        let path = PathFinder.search(pos, goals, { plainCost: 2, swampCost: 10, roomCallback: function(roomName) {
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
        }});

        return path.path;
    },

    travelTo: function(creep, goal) {
        if (!creep.spawning) {
            if (!creep.memory.pathToFollow) {
                if (goal.pos) {
                    goal = goal.pos;
                }

                var range = 0;

                if (Game.map.getTerrainAt(goal) == 'wall') {
                    range = 1;
                }

                creep.memory.pathToFollow = {goalPos: goal, path: this.getPathTo(creep.pos, {pos: goal, range: range})};
            }

            if (creep.memory.pathToFollow !== undefined) {
                creep.move(creep.pos.getDirectionTo(creep.memory.pathToFollow.path[0].x, creep.memory.pathToFollow.path[0].y));
                console.log(creep.pos.x + ', ' + creep.pos.y + ' | ' + creep.memory.pathToFollow.path[0].x + ', ' + creep.memory.pathToFollow.path[0].y + ' - ' + creep.pos.getDirectionTo(creep.memory.pathToFollow.path[0].x, creep.memory.pathToFollow.path[0].y));
                creep.memory.pathToFollow.path.shift();
            }

            if (creep.memory.pathToFollow.path.length == 0) {
                delete creep.memory.pathToFollow;
            }
        }
    }
}
