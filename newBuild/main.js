var utils = require('utils');

module.exports.loop = function () {
    var p1 = new RoomPosition(0, 0, 'sim');
    var p2 = new RoomPosition(10, 10, 'sim');

    var t = Game.cpu.getUsed();
    console.log(utils.distanceTo(p1, p2));
    console.log(Game.cpu.getUsed() - t);
    t = Game.cpu.getUsed();

    console.log(p1.getRangeTo(p2));
    console.log(Game.cpu.getUsed() - t);
}
