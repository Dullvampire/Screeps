var roleBuilder = require('role.builder');

var roleUpgrader = {
    run: function(creep) {
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (s) {
            return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
        }});
        
	    if(creep.memory.mode == 'load') {
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            
            if (container != null && container.store[RESOURCE_ENERGY] == 0) {
                container = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (creep.pickup(container) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            
            if (creep.carry.energy >= creep.carryCapacity) {
                creep.memory.mode = 'unload';
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (o) => (o.hits < o.hitsMax && o.structureType != STRUCTURE_WALL)
            });
            
            if (target != undefined) {
                var attempt = creep.repair(target);
                if (attempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else if (attempt == ERR_NO_BODYPART) {
                    creep.suicide();
                }
            } else {
                roleBuilder.run(creep);
            }
            
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'load';
            }
        }
        
        if (creep.memory.mode == undefined) {
            creep.memory.mode = 'load';
        }
	}
};

module.exports = roleUpgrader;