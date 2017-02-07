module.exports = function (creep) {
    creep.moveTo(Game.getObjectById(creep.memory.target));
};
