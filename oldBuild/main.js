var director = require('director');
var utils = require('utils')

module.exports.loop = function () {

    var t = Game.cpu.getUsed();

    Game.director = director;
    Game.initiateRoles = director.initRoles;

    if (Memory.productionQueue == undefined) {
        Memory.productionQueue = [];
    }

    director.roles = director.initRoles();

    if (Memory.battalionIds == undefined) {
        Memory.battalionIds = {};
    }

    Game.director = director;
    director.handleCommands();

    //Set up memoryVariables used often across roles
    Memory.numRoles = {};

    for (var role in director.rolePriority) {
        Memory.numRoles[director.rolePriority[role]] = utils.countRole(director.rolePriority[role]);
    }

    Memory.constructionSites = utils.findAll(FIND_CONSTRUCTION_SITES);

    director.clearMemory();

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];

        if (!creep.memory.initialized || creep.memory.initialized === undefined) {
            director.runInit(creep);
            creep.memory.initialized = true;
        }

        director.runRole(creep);
    }

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let roomSpawns = room.find(FIND_MY_SPAWNS);

        for (let spawnName in roomSpawns) {
            let spawn = roomSpawns[spawnName];

            director.handleSpawn(spawn);
        }
    }

    for (let role in director.roles) {
        director.runRoleTick(role);
    }

    if (Memory.cpuData == undefined) {
        Memory.cpuData = [];
    }

    Memory.cpuData.push(Game.cpu.getUsed());

    Memory.aveCpu = _.sum(Memory.cpuData) / Memory.cpuData.length;

    if (Memory.cpuData.length >= 3000) {
        delete Memory.cpuData;
    }
}
