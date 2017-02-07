module.exports = function (creep) {
    let target = Game.getObjectById(creep.memory.target);
    let dx = target.pos.x - creep.pos.x;
    let dy = target.pos.y - creep.pos.y;

    return dx * dx + dy * dy <= 9;
}
