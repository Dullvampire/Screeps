var roleUpgrader = {
    run: function(creep) {
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (s) {
            return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
        }});
        
	    if(creep.memory.mode == 'load') {
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            
            if ((container != null && container.store[RESOURCE_ENERGY] == 0) || (container == null))  {
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
            var attempt = creep.upgradeController(creep.room.controller);
            if(attempt == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            } else if (attempt == ERR_NO_BODYPART) {
                creep.suicide();
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