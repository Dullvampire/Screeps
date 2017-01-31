var utils = require('utils');
module.exports = function (role) {
    return (role + ': ' + utils.countRole(role));
}
