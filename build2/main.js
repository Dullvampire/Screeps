const profiler = require('screeps-profiler');

require('creep.prototype')();
require('spawn.prototype')();

var tasks = [{action: 'targetSource', condition: 'true'}, {action: 'moveTo', condition: 'atTarget'}, {action: 'harvest', condition: 'fullEnergy'}, {action: 'targetController', condition: 'true'}, {action: 'moveTo', condition: 'inRangeRanged'}, {action: 'upgrade', condition: 'emptyEnergy'}];

profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function () {
        Memory.tagCount = {};
    
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (!!creep.memory.tag) {
                if (Memory.tagCount[creep.memory.tag] == undefined) {
                    Memory.tagCount[creep.memory.tag] = 1;
                } else {
                    Memory.tagCount[creep.memory.tag] ++;
                }
            }
        }
    
        for (let creepName in Game.creeps) {
            let creep = Game.creeps[creepName];
            creep.runTask();
            creep.say(creep.memory.currentTask, true);
        }
    
        for (let creepName in Memory.creeps) {
            if (Game.creeps[creepName] == undefined) {
                delete Memory.creeps[creepName];
            }
        }
        
        var ratios = {upgrader: 6/16, miner: 5/16, builder: 5/16};
        var target = 16;
        var cCount = Object.keys(Game.creeps).length;
        
        if (Memory.tagCount['upgrader'] < target * ratios.upgrader || !Memory.tagCount['upgrader']) {
            var tasks = [{action: 'targetSource', condition: 'true'}, {action: 'moveTo', condition: 'atTarget'}, {action: 'harvest', condition: 'fullEnergy'}, {action: 'targetController', condition: 'true'}, {action: 'moveTo', condition: 'inRangeRanged'}, {action: 'upgrade', condition: 'emptyEnergy'}];
            Game.spawns.Spawn1.spawnCreep(require('calculateBody').makeBody(tasks, Game.spawns.Spawn1.room.energyAvailable), tasks, [], 'upgrader');
        } else if (Memory.tagCount['miner'] < target * ratios.miner || !Memory.tagCount['miner']) {
            var tasks = [{action: 'targetSource', condition: true}, {action: 'moveTo', condition: 'atTarget'}, {action: 'harvest', condition: 'fullEnergy'}, {action: 'targetSourceOrExtension', condition: 'true'}, {action: 'moveTo', condition: 'atTarget'}, {action: 'transferEnergy', condition: 'emptyEnergy'}];
            Game.spawns.Spawn1.spawnCreep(require('calculateBody').makeBody(tasks, Game.spawns.Spawn1.room.energyAvailable), tasks, [], 'miner');
        } else if (Memory.tagCount['builder'] < target * ratios.builder || !Memory.tagCount['builder']) {
            var tasks = [{action: 'targetSource', condition: true}, {action: 'moveTo', condition: 'atTarget'}, {action: 'harvest', condition: 'fullEnergy'}, {action: 'targetConstructionSite', condition: 'true'}, {action: 'moveTo', condition: 'atTarget'}, {action: 'build', condition: 'emptyEnergy'}];
            Game.spawns.Spawn1.spawnCreep(require('calculateBody').makeBody(tasks, Game.spawns.Spawn1.room.energyAvailable), tasks, [], 'builder');
        }
    
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
    
            if (room.find(FIND_HOSTILE_CREEPS).length > 0) {
                room.controller.activateSafeMode();
            }
        }
    });
};
