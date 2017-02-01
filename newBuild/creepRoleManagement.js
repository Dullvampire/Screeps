module.exports = function () {
    Creep.prototype.doCurrentTask = function () {
        this.memory.taskFunction();
    };

    Creep.prototype.assignTask = function (task) {
        this.memory.taskFunction = task;
    };
};
