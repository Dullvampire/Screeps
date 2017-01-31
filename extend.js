module.exports = function (source, destination) {
    for (let k in source) {
        if (!destination.hasOwnProperty(k)) {
            destination[k] = source[k];
        }
    }

    return destination;
}
