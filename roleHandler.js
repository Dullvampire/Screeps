/*
Imports and manages roles
*/

var extend = require('extend');
var proto = require('role.prototype');

module.exports = {
    roleExists: function (role) {
        try {
            require('role.' + role);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    getRole: function (role) {
        if (this.roleExists(role)) {
            return extend(proto, require('role.' + role));
        }

        return false;
    }
}
