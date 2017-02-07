module.exports = function (creep) {
    var spawns = creep.room.find(FIND_MY_SPAWNS);
    var both = spawns.concat(creep.room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity}));
    creep.memory.target = creep.pos.findClosestByRange(both).id;
}
