/*
Class that controls most of the colony
*/

var utils = require('utils');
var roleHandler = require('roleHandler');

module.exports = {
    rolePriority: ['harvester', 'transporter', 'upgrader', 'builder', 'repairer', 'explorer', 'supplier', 'layer', 'wallRepairer'],
    workers: ['upgrader', 'builder', 'repairer', 'wallRepairer'],

    commands: ['layRoad', 'roleCount', 'attack', 'resetMemoryAverage'],

    roles: {},

    initRoles: function () {
        let returnValue = {};

        for (let role in this.rolePriority) {
            returnValue[this.rolePriority[role]] = roleHandler.getRole(this.rolePriority[role]);
        }

        return returnValue;
    },

    clearMemory: function () {
        for (let creepName in Memory.creeps) {
            if (Game.creeps[creepName] == undefined) {
                delete Memory.creeps[creepName];
            }
        }
    },

    handleSpawn: function (spawn) {
        if (Memory.productionQueue.length === 0) {
            var found = false;
            //First check if any roles are needed
            for (let roleName in this.roles) {
                let role = this.roles[roleName];
                if (role.moreNeededNow(spawn.room)) {
                    found = true
                    if (role.name in this.workers) {
                        utils.spawnCreep(spawn, [WORK, CARRY, MOVE, MOVE], role);
                    } else {
                        utils.spawnCreep(spawn, role.getBody(spawn), role);
                    }
                    break;
                }
            }

            if (!found) {
                for (let roleName in this.roles) {
                    let role = this.roles[roleName];
                    if (role.moreNeeded(spawn.room)) {
                        utils.spawnCreep(spawn, role.getBody(spawn), role);
                        break;
                    }
                }
            }
        } else {
            let creepData = Memory.productionQueue[0];
            if (typeof utils.spawnCreep(spawn, this.roles[creepData.role].getBody(spawn), this.roles[creepData.role], creepData.name, creepData.memory) == 'string') {
                Memory.productionQueue.shift();
            }
        }
    },

    runInit: function (creep) {
        this.roles[creep.memory.role].init(creep);
    },

    runRole: function (creep) {
        this.roles[creep.memory.role].run(creep);
    },

    runRoleTick: function (role) {
        this.roles[role].tick(this);
    },

    handleCommands: function () {
        for (let index in this.commands) {
            Game[this.commands[index]] = require('command.' + this.commands[index])
        }
    }
}
