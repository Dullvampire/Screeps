module.exports = {
    run: function (creep) {
        var attackFlag = Game.flags.Attack;
        
        if (attackFlag != undefined) {
            if (creep.room.name == attackFlag.pos.roomName) {
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                if (target == undefined) {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: function(o) {
                        return o.structureType != STRUCTURE_CONTROLLER
                    }});
                }
                
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                
            } else {
                creep.moveTo(attackFlag);
            }
        } else {
            
        }
    }
};