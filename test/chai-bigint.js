/* eslint-disable no-loss-of-precision */
const chai = require('chai');

const expect = chai.expect;

chai.should();
chai.use(require('../chai-bigint'));
chai.config.includeStack = true;

describe('chai-bigint', function () {
  const customMessage = 'Custom message';
  const customMessageRegex = /^Custom message:/;
  const actualMatchInvalidError = /to be an instance of bigint/;
  const expectedMatchInvalidError = /to be an instance of bigint or string/;

  const testerGenerator = function (functionNames) {
    return [
      function (a, b, msg) {
        functionNames.forEach((functionName) => {
          if (msg) {
            a.should.be.a.bigint.that[functionName](b, msg);
            expect(a).to.be.a.bigint.that[functionName](b, msg);
          } else {
            a.should.be.a.bigint.that[functionName](b);
            expect(a).to.be.a.bigint.that[functionName](b);
          }
        });
      },

      function (a, b, msg) {
        functionNames.forEach((functionName) => {
          if (msg) {
            a.should.not.be.a.bigint.that[functionName](b, msg);
            expect(a).to.not.be.a.bigint.that[functionName](b, msg);
          } else {
            a.should.not.be.a.bigint.that[functionName](b);
            expect(a).to.not.be.a.bigint.that[functionName](b);
          }
        });
      }
    ];
  };

  const argTypeChecker = function (tester, notTester) {
    it('fails when first argument is not bigint or string', function () {
      const testCases = [
        [10, '10'],
        [-10, '-10'],
        [123456789123456789123456789, '123456789123456789123456789'],
        [-123456789123456789123456789, '-123456789123456789123456789']
      ];

      testCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(actualMatchInvalidError);
        (() => notTester(a, b)).should.throw(actualMatchInvalidError);
      });
    });

    it('fails when second argument is not bigint or string', function () {
      const testCases = [
        [10n, 10],
        [-10n, -10],
        [123456789123456789123456789n, 123456789123456789123456789],
        [-123456789123456789123456789n, -123456789123456789123456789]
      ];

      testCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(expectedMatchInvalidError);
        (() => notTester(a, b)).should.throw(expectedMatchInvalidError);
      });
    });
  };

  const toBigIntCombinations = function (a, b) {
    return [
      [a, b],
      [BigInt(a), b],
      [a, BigInt(b)],
      [BigInt(a), BigInt(b)]
    ];
  };

  describe('equal/equals/eq', function () {
    const [tester, notTester] = testerGenerator(['equal', 'equals', 'eq']);
    const equalTestCases = [
      ...toBigIntCombinations('10', '10'),
      ...toBigIntCombinations('-10', '-10'),
      ...toBigIntCombinations('123456789123456789123456789', '123456789123456789123456789'),
      ...toBigIntCombinations('-123456789123456789123456789', '-123456789123456789123456789')
    ];
    const notEqualTestCases = [
      ...toBigIntCombinations('10', '9'),
      ...toBigIntCombinations('-10', '-9'),
      ...toBigIntCombinations('123456789123456789123456789', '123456789123456789123456788'),
      ...toBigIntCombinations('-123456789123456789123456789', '-123456789123456789123456788')
    ];
    it('asserts equality', function () {
      equalTestCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts inequality', function () {
      notEqualTestCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    it('equal fails on inequality', function () {
      notEqualTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not equal fails on equality', function () {
      equalTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, 'Custom message')).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('above/gt/greaterThan', function () {
    const [tester, notTester] = testerGenerator(['above', 'gt', 'greaterThan']);
    const aboveTestCases = [
      ...toBigIntCombinations('15', '10'),
      ...toBigIntCombinations('15', '-10'),
      ...toBigIntCombinations('-10', '-15'),

      ...toBigIntCombinations('123456789123456789', '123456789123'),
      ...toBigIntCombinations('123456789123456789', '-123456789123'),
      ...toBigIntCombinations('-123456789123', '-123456789123456789')
    ];

    const notAbovetestCases = [
      ...toBigIntCombinations('10', '15'),
      ...toBigIntCombinations('-10', '15'),
      ...toBigIntCombinations('-15', '-10'),
      ...toBigIntCombinations('-15', '15'),
      ...toBigIntCombinations('-15', '-15'),

      ...toBigIntCombinations('123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123456789', '-123456789123')
    ];

    it('asserts aboveness', function () {
      aboveTestCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unaboveness', function () {
      notAbovetestCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    it('above fails on unaboveness', function () {
      notAbovetestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not above fails on aboveness', function () {
      aboveTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('least/gte', function () {
    const [tester, notTester] = testerGenerator(['gte']);
    const atLeastTestCases = [
      ...toBigIntCombinations('15', '15'),
      ...toBigIntCombinations('15', '-10'),
      ...toBigIntCombinations('-10', '-15'),
      ...toBigIntCombinations('15', '15'),
      ...toBigIntCombinations('-15', '-15'),

      ...toBigIntCombinations('123456789123456789', '123456789123456789'),
      ...toBigIntCombinations('123456789123456789', '-123456789123'),
      ...toBigIntCombinations('-123456789123', '-123456789123456789'),
      ...toBigIntCombinations('123456789123456789', '123456789123456789'),
      ...toBigIntCombinations('-123456789123456789', '-123456789123456789')
    ];

    const notAtLeastTestCases = [
      ...toBigIntCombinations('10', '15'),
      ...toBigIntCombinations('-10', '15'),
      ...toBigIntCombinations('-15', '-10'),

      ...toBigIntCombinations('123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123456789', '-123456789123')
    ];

    it('asserts at least', function () {
      atLeastTestCases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.a.bigint.that.is.at.least(b);
        expect(a).to.be.a.bigint.that.is.at.least(b);
      });
    });

    it('asserts not at least', function () {
      notAtLeastTestCases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.a.bigint.that.is.at.least(b);
        expect(a).to.not.be.a.bigint.that.is.at.least(b);
      });
    });

    it('at least fails fails on unaboveness', function () {
      notAtLeastTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('at most fails on aboveness', function () {
      atLeastTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('below/lt/lessThan', function () {
    const [tester, notTester] = testerGenerator(['below', 'lt', 'lessThan']);
    const belowTestCases = [
      ...toBigIntCombinations('10', '15'),
      ...toBigIntCombinations('-10', '15'),
      ...toBigIntCombinations('-15', '-10'),

      ...toBigIntCombinations('123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123456789', '-123456789123')
    ];

    const notBelowTestCases = [
      ...toBigIntCombinations('15', '10'),
      ...toBigIntCombinations('15', '-10'),
      ...toBigIntCombinations('-10', '-15'),
      ...toBigIntCombinations('15', '15'),
      ...toBigIntCombinations('-15', '-15'),

      ...toBigIntCombinations('123456789123456789', '123456789123'),
      ...toBigIntCombinations('123456789123456789', '-123456789123'),
      ...toBigIntCombinations('-123456789123', '-123456789123456789'),
      ...toBigIntCombinations('123456789123456789', '123456789123456789'),
      ...toBigIntCombinations('-123456789123456789', '-123456789123456789')
    ];

    it('asserts belowness', function () {
      belowTestCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unbelowness', function () {
      notBelowTestCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    it('below fails on unbelowness', function () {
      notBelowTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not below fails on belowness', function () {
      belowTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('most/lte', function () {
    const [tester, notTester] = testerGenerator(['lte']);
    const atMostTestCases = [
      ...toBigIntCombinations('10', '15'),
      ...toBigIntCombinations('-10', '15'),
      ...toBigIntCombinations('-15', '-10'),
      ...toBigIntCombinations('15', '15'),
      ...toBigIntCombinations('-15', '-15'),

      ...toBigIntCombinations('123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123', '123456789123456789'),
      ...toBigIntCombinations('-123456789123456789', '-123456789123'),
      ...toBigIntCombinations('123456789123456789', '123456789123456789'),
      ...toBigIntCombinations('-123456789123456789', '-123456789123456789')
    ];
    const notAtMostTestCases = [
      ...toBigIntCombinations('15', '10'),
      ...toBigIntCombinations('15', '-10'),
      ...toBigIntCombinations('-10', '-15'),

      ...toBigIntCombinations('123456789123456789', '123456789123'),
      ...toBigIntCombinations('123456789123456789', '-123456789123'),
      ...toBigIntCombinations('-123456789123', '-123456789123456789')
    ];

    it('asserts at most', function () {
      atMostTestCases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.a.bigint.that.is.at.most(b);
        expect(a).to.be.a.bigint.that.is.at.most(b);
      });
    });

    it('asserts not at most', function () {
      notAtMostTestCases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.a.bigint.at.most(b);
        expect(a).to.not.be.a.bigint.at.most(b);
      });
    });

    it('at most fails on not at most input', function () {
      notAtMostTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
        (() => a.should.be.a.bigint.at.most(b, customMessage)).should.throw(customMessageRegex);
        (() => expect(a).to.be.a.bigint.at.most(b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not at most fails on at most input', function () {
      atMostTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
        (() => a.should.not.be.a.bigint.at.most(b, customMessage)).should.throw(customMessageRegex);
        (() => expect(a).to.not.be.a.bigint.at.most(b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('closeTo', function () {
    const tester = function (a, b, delta, customMessage) {
      a.should.be.a.bigint.closeTo(b, delta, customMessage);
      expect(a).to.be.a.bigint.closeTo(b, delta, customMessage);
    };

    const notTester = function (a, b, delta, customMessage) {
      a.should.be.a.bigint.not.closeTo(b, delta, customMessage);
      expect(a).to.be.a.bigint.not.closeTo(b, delta, customMessage);
    };
    const closeTestCases = [
      [15n, '15', '0'],
      [15n, '10', '5'],
      [15n, '20', '5'],
      [-15n, '-15', '0'],
      [-15n, '-10', '5'],
      [-15n, '-20', '5'],
      [123456789123456789n, '123456789123456789', '0'],
      [123456789123456789n, '123456789123456780', '9'],
      [123456789123456789n, '123456789123456798', '9'],
      [-123456789123456789n, '-123456789123456789', '0'],
      [-123456789123456789n, '-123456789123456780', '9'],
      [-123456789123456789n, '-123456789123456798', '9']
    ];
    const notCloseTestCases = [
      [15n, '14', '0'],
      [15n, '9', '5'],
      [15n, '21', '5'],
      [-15n, '-16', '0'],
      [-15n, '-9', '5'],
      [-15n, '-21', '5'],
      [123456789123456789n, '123456789123456788', '0'],
      [123456789123456789n, '123456789123456779', '9'],
      [123456789123456789n, '123456789123456799', '9'],
      [-123456789123456789n, '-123456789123456788', '0'],
      [-123456789123456789n, '-123456789123456779', '9'],
      [-123456789123456789n, '-123456789123456799', '9']
    ];

    it('asserts closeness', function () {
      closeTestCases.forEach(([a, b, delta]) => {
        tester(a, b, delta);
        (() => notTester(a, b, delta)).should.throw;
      });
    });

    it('asserts not closeness', function () {
      notCloseTestCases.forEach(([a, b, delta]) => {
        notTester(a, b, delta);
        (() => tester(a, b, delta)).should.throw;
      });
    });

    it('close fails on not closeness', function () {
      notCloseTestCases.forEach(([a, b, delta]) => {
        (() => tester(a, b, delta)).should.throw();
        (() => tester(a, b, delta, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not close fails on closeness', function () {
      closeTestCases.forEach(([a, b, delta]) => {
        (() => notTester(a, b, delta)).should.throw();
        (() => notTester(a, b, delta, customMessage)).should.throw(customMessageRegex);
      });
    });
  });

  describe('negative', function () {
    const tester = function (a) {
      a.should.be.a.bigint.that.is.negative;
      expect(a).to.be.a.bigint.that.is.negative;
    };

    const notTester = function (a) {
      a.should.not.be.a.bigint.that.is.negative;
      expect(a).to.not.be.a.bigint.that.is.negative;
    };

    it('asserts negativity', function () {
      const testCases = [-1n, -1234856789123456789n];

      testCases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unnegativity', function () {
      const testCases = [0n, 1n, 1234856789123456789n];

      testCases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not bigint or string', function () {
      const testCases = [-5, 0, 5];

      testCases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });

  describe('zero', function () {
    const tester = function (a) {
      a.should.be.a.bigint.that.is.zero;
      expect(a).to.be.a.bigint.that.is.zero;
    };

    const notTester = function (a) {
      a.should.not.be.a.bigint.that.is.zero;
      expect(a).to.not.be.a.bigint.that.is.zero;
    };

    it('asserts zeroness', function () {
      const testCases = [0n];

      testCases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unzeroness', function () {
      const testCases = [1n, -1n, 123456789123456789n, -123456789123456789n];

      testCases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not bigint or string', function () {
      const testCases = [-5, 0, 5];

      testCases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });
});
