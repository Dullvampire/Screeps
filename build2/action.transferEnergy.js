module.exports = function (creep) {
    if (creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) < 0) {
        require('action.targetSourceOrExtension')(creep);
        require('action.moveTo')(creep);
    }
}
