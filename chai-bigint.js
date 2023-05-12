module.exports = function (chai, utils) {
  const flag = utils.flag;
  // The 'bigint' property sets the 'bigint' flag, enabling the custom overrides
  chai.Assertion.addProperty('bigint', function () {
    utils.flag(this, 'bigint', true);
  });

  const isBigInt = function (object) {
    return typeof object === 'bigint';
  };

  const convert = function (value) {
    if (isBigInt(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return BigInt(value);
    } else {
      new chai.Assertion(value).assert(false, 'expected #{act} to be an instance of bigint or string');
    }
  };

  // Overwrites the assertion performed by multiple methods (which should be aliases) with a new function. Prior to
  // calling said function, we assert that the actual value is a bigint, and attempt to convert all other arguments to
  // bigint.
  const overwriteMethods = function (messageIndex, methodNames, newAssertion) {
    function overwriteMethod(originalAssertion) {
      return function () {
        if (utils.flag(this, 'bigint')) {
          const actual = convert(this._obj);
          const args = [actual]
            .concat([].slice.call(arguments).slice(0, messageIndex).map(convert))
            .concat(arguments[messageIndex]);
          newAssertion.apply(this, args);
        } else {
          originalAssertion.apply(this, arguments);
        }
      };
    }

    methodNames.forEach((methodName) => chai.Assertion.overwriteMethod(methodName, overwriteMethod));
  };

  // Overwrites the assertion performed by multiple properties (which should be aliases) with a new function. Prior to
  // calling said function, we assert that the actual value is a bigint.
  const overwriteProperties = function (propertyNames, newAssertion) {
    function overwriteProperty(originalAssertion) {
      return function () {
        if (utils.flag(this, 'bigint')) {
          const actual = convert(this._obj);

          newAssertion.apply(this, [actual]);
        } else {
          originalAssertion.call(this);
        }
      };
    }

    propertyNames.forEach((propertyName) => chai.Assertion.overwriteProperty(propertyName, overwriteProperty));
  };

  overwriteMethods(1, ['equal', 'equals', 'eq'], function (actual, expected, msg) {
    if (msg) {
      flag(this, 'message', msg);
    }

    this.assert(
      expected === actual,
      'expected #{act} to equal #{exp}',
      'expected #{act} to be different from #{exp}',
      expected.toString(),
      actual.toString()
    );
  });

  overwriteMethods(1, ['above', 'gt', 'greaterThan'], function (actual, expected, msg) {
    if (msg) {
      flag(this, 'message', msg);
    }

    this.assert(
      actual > expected,
      'expected #{act} to be greater than #{exp}',
      'expected #{act} to be less than or equal to #{exp}',
      expected.toString(),
      actual.toString()
    );
  });

  overwriteMethods(1, ['least', 'gte'], function (actual, expected, msg) {
    if (msg) {
      flag(this, 'message', msg);
    }

    this.assert(
      actual >= expected,
      'expected #{act} to be greater than or equal to #{exp}',
      'expected #{act} to be less than #{exp}',
      expected.toString(),
      actual.toString()
    );
  });

  overwriteMethods(1, ['below', 'lt', 'lessThan'], function (actual, expected, msg) {
    if (msg) {
      flag(this, 'message', msg);
    }
    this.assert(
      actual < expected,
      'expected #{act} to be less than #{exp}',
      'expected #{act} to be greater than or equal to #{exp}',
      expected.toString(),
      actual.toString()
    );
  });

  overwriteMethods(1, ['most', 'lte'], function (actual, expected, msg) {
    if (msg) {
      flag(this, 'message', msg);
    }
    this.assert(
      actual <= expected,
      'expected #{act} to be less than or equal to #{exp}',
      'expected #{act} to be greater than #{exp}',
      expected.toString(),
      actual.toString()
    );
  });

  overwriteMethods(2, ['closeTo'], function (actual, expected, delta, msg) {
    if (msg) {
      flag(this, 'message', msg);
    }
    this.assert(
      actual >= expected - delta && actual <= expected + delta,
      `expected #{act} to be within '${delta}' of #{exp}`,
      `expected #{act} to be further than '${delta}' from #{exp}`,
      expected.toString(),
      actual.toString()
    );
  });

  overwriteProperties(['negative'], function (value) {
    this.assert(value < 0n, 'expected #{this} to be negative', 'expected #{this} to not be negative', value.toString());
  });

  overwriteProperties(['zero'], function (value) {
    this.assert(value === 0n, 'expected #{this} to be zero', 'expected #{this} to not be zero', value.toString());
  });
};
