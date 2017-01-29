module.exports = {
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (o) => o.structureType == STRUCTURE_TOWER});
        var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function (s) {
            return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
        }});
        
        if (target == undefined) {
            target = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        }
        
	    if(creep.memory.mode == 'load') {
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            
            if ((source != null && source.store[RESOURCE_ENERGY] == 0 && target.energy < target.energyCapacity) || (source == null)) {
                source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
           }
            
            if (creep.carry.energy >= creep.carryCapacity) {
                creep.memory.mode = 'unload';
            }
        } else {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
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