var roleUpgrader = require('role.upgrader');

var roleBuilder = {
    run: function(creep) {
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (s) {
            return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
        }});
        
	    if(creep.memory.mode == 'load') {
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            
            if ((container != null && container.store[RESOURCE_ENERGY] == 0) || (container == null)) {
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
            if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                var constructSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                
                
                var attempt = creep.build(constructSite);
                if (attempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructSite);
                } else if (attempt == ERR_NO_BODYPART) {
                    creep.suicide();
                }
            } else {
                roleUpgrader.run(creep);
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

module.exports = roleBuilder;