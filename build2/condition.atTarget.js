module.exports = function (creep) {
    if (!Game.getObjectById(creep.memory.target)) {
        return true;
    }
    let target = Game.getObjectById(creep.memory.target);
    let dx = target.pos.x - creep.pos.x;
    let dy = target.pos.y - creep.pos.y;

    return dx * dx + dy * dy <= 2;
}
