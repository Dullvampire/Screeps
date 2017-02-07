module.exports = function (creep) {
    if (creep.harvest(Game.getObjectById(creep.memory.target)) < 0) {
        creep.cycleTasks();
    }
};
