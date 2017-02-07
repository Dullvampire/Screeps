module.exports = function () {
    Spawn.prototype.spawnCreep = function (body, tasks, initTasks, tag) { //Tasks is an array of objects
        if (initTasks == undefined) {
            initTasks = [{action: 'none', condition: 'true'}];
        }

        if (tag == undefined) {
            tag = ''
        }

        return this.createCreep(body, null, {tasks: tasks, initTasks: initTasks, init: false, tag: tag});
    }
};
