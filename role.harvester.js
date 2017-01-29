var upgrade = require('role.upgrader');

module.exports = {
    run: function(creep) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES, {ignoreCreeps: false});
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
        
        var hasWork = false;
        
        for (var part in creep.body) {
            if (creep.body[part].type == 'work') {
                hasWork = true;
            }
        }
        
        if (!hasWork) {
            creep.suicide();
        }
        
        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.drop(RESOURCE_ENERGY);
        } else if (target == null) {
            creep.drop(RESOURCE_ENERGY);
        }
    }
};