var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransporter = require('role.transporter');
var roleWallRepairer = require('role.wallRepairer');
var roleWarrior = require('role.warrior');
var roleSupplier = require('role.supplier');

var roles = ['harvester', 'transporter', 'upgrader', 'builder', 'repairer', 'wallRepairer', 'warrior', 'supplier'];

var defaultRole = 'upgrader';

var roleFunctions = { upgrader: roleUpgrader,
                      harvester: roleHarvester,
                      builder: roleBuilder,
                      repairer: roleRepairer,
                      transporter: roleTransporter,
                      wallRepairer: roleWallRepairer,
                      warrior: roleWarrior,
                      supplier: roleSupplier
                    };

var defaultSetups = { upgrader: [CARRY, WORK, MOVE],
                      harvester: [WORK, WORK, CARRY, MOVE],
                      builder: [CARRY, WORK, WORK, MOVE],
                      repairer: [CARRY, WORK, MOVE, MOVE],
                      wallRepairer: [CARRY, WORK, MOVE, MOVE],
                      transporter: [CARRY, CARRY, CARRY, CARRY, MOVE],
                      warrior: [MOVE, MOVE, MOVE, ATTACK, ATTACK],
                      supplier: [CARRY, CARRY, CARRY, CARRY, MOVE]
                    };

module.exports.loop = function () {
    var currRoom;
    var sources;
    var csp; //Current Source Position
    var items;
    var item;
    
    for (var roomIndex in Game.rooms) {
        currRoom = Game.rooms[roomIndex];
        sources = currRoom.find(FIND_SOURCES);
        for (var sourceIndex in sources) {
            csp = sources[sourceIndex].pos;
            
            items = Game.rooms[roomIndex].lookAtArea(csp.y - 1, csp.x - 1, csp.y + 1, csp.x + 1, true);
            
            for (var itemIndex in items) {
                item = items[itemIndex];
                
                if (item.type == 'creep') {
                    if (item.creep.my) {
                        //item.creep.memory.role = 'harvester';
                    }
                }
            }
        }
    }
    
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if (_.sum(Game.creeps, (c) => c.memory.role == 'harvester') == 0 && creep.memory.role != 'transporter') {
            creep.memory.role = 'harvester';
        }
        if (_.sum(Game.creeps, (c) => c.memory.role == 'transporter') == 0 && creep.memory.role != 'harvester') {
            creep.memory.role = 'transporter';
        }
        
        roleFunctions[creep.memory.role].run(creep);
        
        //creep.say(creep.memory.role.charAt(0).toUpperCase() + ((creep.memory.mode == undefined) ? '' : creep.memory.mode.charAt(0).toLowerCase()));
    }
    
    for (var currRoom in Game.rooms) {
        var ruum = Game.rooms[currRoom];
        var rCreeps = ruum.find(FIND_MY_CREEPS);
        
        //Mins in order: U H B R
        var mins = {upgrader: 5,
            harvester: 8,
            builder: Math.ceil(ruum.find(FIND_CONSTRUCTION_SITES, {
                filter: function (object) {
                    return object.my
                }
            }).length / 8),
            repairer: Math.ceil(ruum.find(FIND_STRUCTURES, {
                filter: function (object) {
                    return object.structureType != STRUCTURE_WALL
                }
            }).length / 10),
            wallRepairer: Math.ceil(ruum.find(FIND_STRUCTURES, {
                filter: function (object) {
                    return object.structureType == STRUCTURE_WALL
                }
            }).length / 10),
            transporter: 2,
            warrior: 0,
            supplier: ruum.find(FIND_MY_STRUCTURES, {
                filter: function(object) {
                    return object.structureType == STRUCTURE_TOWER
                }
            }).length
        };
        
        var nums = {};
        
        for (var r in roles) {
            nums[roles[r]] = _.sum(rCreeps, (c) => c.memory.role == roles[r]);
        }
        
        var roomSpawns = ruum.find(FIND_MY_SPAWNS);
        
        for (var currSpawn in roomSpawns) {
            var spawn = roomSpawns[currSpawn];
            
            var spawnedNew = false;
            
            var foundOne = false;
            
            for (var r in roles) {
                if (nums[roles[r]] < mins[roles[r]]) {
                    if (!foundOne || foundOne) {
                        var success = spawn.createCreep(defaultSetups[roles[r]], undefined, {role: roles[r]});
                        if (success > 0) {
                            console.log(roles[r] + ' created');
                        } else {
                            foundOne = true;
                        }
                        spawnedNew = true;
                    }
                }
            }
            
            if (!spawnedNew) {
                //spawn.createCreep(defaultSetups[defaultRole], undefined, {role: defaultRole})
            }
        }
    }
    
    var differences = {};
    
    for (var r in roles) {
        differences[roles[r]] = mins[roles[r]] - nums[roles[r]];
    }
    
    var over = [];
    var under = [];
    
    for (var r in roles) {
        if (differences[roles[r]] > 0) {
            under.push(roles[r]);
        } else if (differences[roles[r]] < 0) {
            over.push(roles[r]);
        }
    }
    
    var prntString = '';
    
    for (var r in roles) {
        role = roles[r];
        prntString = prntString.concat(role + ': ' + nums[role] + '/' + mins[role] + '\n');
    }
    
    prntString = prntString.slice(0, -1);
    
    console.log(prntString);
    
    var cpuUsed = Math.round(Game.cpu.getUsed());
    
    //log(Math.round(Game.cpu.getUsed()) + '/' + Game.cpu.limit + ' ~ ' + (Game.cpu.limit - cpuUsed) + ', ' + Math.max(0, Math.min(Game.cpu.bucket + (Game.cpu.limit - cpuUsed), 10000)));
    
};