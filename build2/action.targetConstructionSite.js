module.exports = function (creep) {
    creep.memory.target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES).id;
}
