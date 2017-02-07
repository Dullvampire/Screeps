module.exports = function () {
    Creep.prototype.runTask = function () {
        if (!this.memory.tasks) {
            console.log('CREEP ' + this.name + ' does not have tasks');
        } else {
            if (!this.memory.initTasks || this.memory.initTasks.length == 0) {
                this.memory.init = true
            }
            if (this.memory.init) {
                this.memory.currentTask = this.memory.tasks[0].action;

                require('action.' + this.memory.tasks[0].action)(this);

                if (require('condition.' + this.memory.tasks[0].condition)(this)) {
                    if (this.memory.tasks[0].endAction != undefined) {
                        require('action.' + this.memory.tasks[0].endAction)(this);
                    }

                    this.cycleTasks();
                }
            } else {
                require('action.' + this.memory.initTasks[0].action)(this);

                if (require('condition.' + this.memory.initTasks[0].condition)(this)) {
                    if (this.memory.initTasks[0].endAction != undefined) {
                        require('action.' + this.memory.initTasks[0].endAction)(this);
                    }
                    this.memory.initTasks.shift();
                }

                if (this.memory.initTasks.length == 0) {
                    this.memory.init = true;
                    delete this.memory.initTasks;
                }
            }
        }
    };

    Creep.prototype.cycleTasks = function () {
        this.memory.tasks.push(this.memory.tasks.shift());
    };
};
