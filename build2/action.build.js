module.exports = function (creep) {
    if (creep.build(Game.getObjectById(creep.memory.target)) < 0) {
        creep.cycleTasks();
    }
}
