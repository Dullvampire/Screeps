var utils = require('utils');

module.exports = {
    name: '',

    moreNeededNow: function (room) {
        return utils.countRole(this.name, room) === 0;
    },

    moreNeeded: function (room) {
        return false;
    },

    enough: function () {
        return false;
    },

    getBody: function (spawn) {
        return [WORK, CARRY, MOVE];
    },

    run: function (creep) {
        return true;
    },

    tick: function (director) {
        return true;
    },

    init: function (creep) {
        return true;
    }
}
