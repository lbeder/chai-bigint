"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
require("./types");
function supportBigInt(Assertion, utils) {
    Assertion.overwriteMethod('equals', override('eq', 'equal', utils));
    Assertion.overwriteMethod('equal', override('eq', 'equal', utils));
    Assertion.overwriteMethod('eq', override('eq', 'equal', utils));
    Assertion.overwriteMethod('above', override('gt', 'above', utils));
    Assertion.overwriteMethod('gt', override('gt', 'greater than', utils));
    Assertion.overwriteMethod('below', override('lt', 'below', utils));
    Assertion.overwriteMethod('lt', override('lt', 'less than', utils));
    Assertion.overwriteMethod('least', override('gte', 'at least', utils));
    Assertion.overwriteMethod('gte', override('gte', 'greater than or equal', utils));
    Assertion.overwriteMethod('most', override('lte', 'at most', utils));
    Assertion.overwriteMethod('lte', override('lte', 'less than or equal', utils));
    Assertion.overwriteMethod('within', overrideWithin(utils));
    Assertion.overwriteMethod('closeTo', overrideCloseTo(utils));
}
function chaiBigInt(chai, utils) {
    supportBigInt(chai.Assertion, utils);
}
exports.default = chaiBigInt;
function override(method, name, utils) {
    return (_super) => overwriteBigIntFunction(method, name, _super, utils);
}
function isBigInt(obj) {
    return typeof obj === 'bigint';
}
function overwriteBigIntFunction(functionName, readableName, _super, chaiUtils) {
    return function (...args) {
        const [expected] = args;
        const actual = chaiUtils.flag(this, 'object');
        if (chaiUtils.flag(this, 'doLength') && isBigInt(expected)) {
            _super.apply(this, [expected.toNumber()]);
            return;
        }
        if (isBigInt(actual) || isBigInt(expected)) {
            let cond = false;
            switch (functionName) {
                case 'eq':
                    cond = BigInt(actual) === BigInt(expected);
                    break;
                case 'gt':
                    cond = BigInt(actual) > BigInt(expected);
                    break;
                case 'gte':
                    cond = BigInt(actual) >= BigInt(expected);
                    break;
                case 'lt':
                    cond = BigInt(actual) < BigInt(expected);
                    break;
                case 'lte':
                    cond = BigInt(actual) <= BigInt(expected);
                    break;
            }
            this.assert(cond, `Expected "${actual}" to be ${readableName} ${expected}`, `Expected "${actual}" NOT to be ${readableName} ${expected}`, actual, expected);
        }
        else {
            _super.apply(this, args);
        }
    };
}
function overrideWithin(utils) {
    return (_super) => overwriteBigNumberWithin(_super, utils);
}
function overwriteBigNumberWithin(_super, chaiUtils) {
    return function (...args) {
        const [start, finish] = args;
        const actual = chaiUtils.flag(this, 'object');
        if (isBigInt(actual) || isBigInt(start) || isBigInt(finish)) {
            this.assert(BigInt(start) <= actual && BigInt(finish) >= actual, `Expected "${actual}" to be within [${[start, finish]}]`, `Expected "${actual}" NOT to be within [${[start, finish]}]`, [start, finish], actual);
        }
        else {
            _super.apply(this, args);
        }
    };
}
function overrideCloseTo(utils) {
    return (_super) => overwriteBigNumberCloseTo(_super, utils);
}
function overwriteBigNumberCloseTo(_super, chaiUtils) {
    return function (...args) {
        const [expected, delta] = args;
        const actual = chaiUtils.flag(this, 'object');
        if (isBigInt(actual) || isBigInt(expected) || isBigInt(delta)) {
            this.assert(BigInt(actual) >= BigInt(expected) - BigInt(delta) && BigInt(actual) <= BigInt(expected) + BigInt(delta), `Expected "${actual}" to be within ${delta} of ${expected}`, `Expected "${actual}" NOT to be within ${delta} of ${expected}`, `A number between ${BigInt(expected) - BigInt(delta)} and ${BigInt(expected) - BigInt(delta)}`, actual);
        }
        else {
            _super.apply(this, args);
        }
    };
}
//# sourceMappingURL=chai-bigint.js.map