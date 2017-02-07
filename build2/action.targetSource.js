module.exports = function (creep) {
    creep.memory.target = creep.pos.findClosestByRange(FIND_SOURCES).id;
};
