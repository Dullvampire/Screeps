var utils = require('utils');

module.exports = function (waypointName) {
    if (Game.creeps[waypointName] != undefined) {
        console.log('Waypoint name must be unique among creeps');
        return;
    }

    utils.addToQueue('explorer', waypointName, {route: utils.parseWaypoint(waypointName)});
}
