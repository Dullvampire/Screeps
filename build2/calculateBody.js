var actionAndConditionValues = {harvest: WORK, moveTo: MOVE, upgrade: WORK, fullEnergy: CARRY, emptyEnergy: CARRY, build: WORK};
var partOrder = [TOUGH, WORK, ATTACK, RANGED_ATTACK, HEAL, CARRY, CLAIM, MOVE];

module.exports = {
    makeBody: function (tasks, maxEnergy) {
        let parts = {move: 0, work: 0, carry: 0, attack: 0, ranged_attack: 0, heal: 0, claim: 0, tough: 0};

        for (let task of tasks) {
            if (actionAndConditionValues[task.action] in parts) { parts[actionAndConditionValues[task.action]] ++; }
            if (actionAndConditionValues[task.condition] in parts) { parts[actionAndConditionValues[task.condition]] ++; }
            if (actionAndConditionValues[task.endAction] in parts) { parts[actionAndConditionValues[task.endAction]] ++; }
        }

        var g = this.gcd(this._values(parts));
        for (let p in parts) {
            parts[p] = parts[p] / g;
        }

        var cost = this.calculateCost2(parts[partOrder[0]], parts[partOrder[1]], parts[partOrder[2]], parts[partOrder[3]], parts[partOrder[4]], parts[partOrder[5]], parts[partOrder[6]], parts[partOrder[7]])
        var numberOfBodies = Math.floor(maxEnergy / cost);

        var body = _.map(partOrder, function (p) {
            let ps = [];

            for (let i = 0; i < parts[p] * numberOfBodies; i ++) {
                ps.push(p);
            }

            return ps;
        });

        //console.log(numberOfBodies, cost, this._values(parts))

        return _.flatten(body);
    },

    _values: function (object) {
        let v = [];

        for (let k in object) {
            v.push(object[k]);
        }

        return v;
    },

    gcd: function (numbers) {
        let n = numbers[0];

        for (let i = 1; i < numbers.length; i ++) {
            n = this._gcd(n, numbers[i]);
        }

        return n;
    },

    _gcd: function (a, b) {
        while (b) {
            let temp = a;
            a = b;
            b = temp % b;
        }

        return a;
    },

    calculateCost: function (body) {
        return _.sum(body, p => BODYPART_COST[p]);
    },

    calculateCost2: function (tough, work, attack, ranged_attack, heal, carry, claim, move) {
        return tough * 10 +
               work * 100 +
               attack * 80 +
               ranged_attack * 150 +
               heal * 250 +
               carry * 50 +
               claim * 600 +
               move * 50;
    }
}
