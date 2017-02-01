var utils = require('utils');

module.exports = function (wayPoint) {
    utils.addToQueue('layer', wayPoint);
}
