module.exports = {
    distanceTo: function (pos1, pos2) {
        if (pos1.pos) {
            pos1 = pos1.pos;
        }

        if (pos2.pos) {
            pos2 = pos2.pos
        }

        var deltaX = (pos1.x - pos2.x);
        var deltaY = (pos1.y - pos2.y);

        return deltaX * deltaX + deltaY * deltaY;
    }
}
