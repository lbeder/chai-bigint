import chaiBigInt from '../src/chai-bigint';
import chai from 'chai';
import { AssertionError, expect } from 'chai';

chai.use(chaiBigInt);

describe('BigInt matchers', () => {
  function checkAll(
    actual: bigint,
    expected: bigint,
    test: (actual: number | string | bigint, expected: number | string | bigint) => void
  ) {
    test(actual, expected);
    test(BigInt(actual), expected);
    test(BigInt(actual), expected.toString());
    test(BigInt(actual), BigInt(expected));
    test(actual, BigInt(expected));
    test(actual.toString(), BigInt(expected));
  }

  describe('equal', () => {
    it('.to.equal', () => {
      checkAll(10n, 10n, (a, b) => expect(a).to.equal(b));
    });

    it('.to.eq', () => {
      checkAll(10n, 10n, (a, b) => expect(a).to.eq(b));
    });

    it('.not.to.equal', () => {
      checkAll(10n, 11n, (a, b) => expect(a).not.to.equal(b));
    });

    it('.not.to.eq', () => {
      checkAll(10n, 11n, (a, b) => expect(a).not.to.eq(b));
    });

    it('throws proper message on error', () => {
      expect(() => expect(BigInt(10)).to.equal(11)).to.throw(AssertionError, 'Expected "10" to be equal 11');
    });
  });

  describe('above', () => {
    it('.to.be.above', () => {
      checkAll(10n, 9n, (a, b) => expect(a).to.be.above(b));
    });

    it('.to.be.gt', () => {
      checkAll(10n, 9n, (a, b) => expect(a).to.be.gt(b));
    });

    it('.not.to.be.above', () => {
      checkAll(10n, 10n, (a, b) => expect(a).not.to.be.above(b));
      checkAll(10n, 11n, (a, b) => expect(a).not.to.be.above(b));
    });

    it('.not.to.be.gt', () => {
      checkAll(10n, 10n, (a, b) => expect(a).not.to.be.gt(b));
      checkAll(10n, 11n, (a, b) => expect(a).not.to.be.gt(b));
    });
  });

  describe('below', () => {
    it('.to.be.below', () => {
      checkAll(10n, 11n, (a, b) => expect(a).to.be.below(b));
    });

    it('.to.be.lt', () => {
      checkAll(10n, 11n, (a, b) => expect(a).to.be.lt(b));
    });

    it('.not.to.be.below', () => {
      checkAll(10n, 10n, (a, b) => expect(a).not.to.be.below(b));
      checkAll(10n, 9n, (a, b) => expect(a).not.to.be.below(b));
    });

    it('.not.to.be.lt', () => {
      checkAll(10n, 10n, (a, b) => expect(a).not.to.be.lt(b));
      checkAll(10n, 9n, (a, b) => expect(a).not.to.be.lt(b));
    });
  });

  describe('at least', () => {
    it('.to.be.at.least', () => {
      checkAll(10n, 10n, (a, b) => expect(a).to.be.at.least(b));
      checkAll(10n, 9n, (a, b) => expect(a).to.be.at.least(b));
    });

    it('.to.be.gte', () => {
      checkAll(10n, 10n, (a, b) => expect(a).to.be.gte(b));
      checkAll(10n, 9n, (a, b) => expect(a).to.be.gte(b));
    });

    it('.not.to.be.at.least', () => {
      checkAll(10n, 11n, (a, b) => expect(a).not.to.be.at.least(b));
    });

    it('.not.to.be.gte', () => {
      checkAll(10n, 11n, (a, b) => expect(a).not.to.be.gte(b));
    });
  });

  describe('at most', () => {
    it('.to.be.at.most', () => {
      checkAll(10n, 10n, (a, b) => expect(a).to.be.at.most(b));
      checkAll(10n, 11n, (a, b) => expect(a).to.be.at.most(b));
    });

    it('.to.be.lte', () => {
      checkAll(10n, 10n, (a, b) => expect(a).to.be.lte(b));
      checkAll(10n, 11n, (a, b) => expect(a).to.be.lte(b));
    });

    it('.not.to.be.at.most', () => {
      checkAll(10n, 9n, (a, b) => expect(a).not.to.be.at.most(b));
    });

    it('.not.to.be.lte', () => {
      checkAll(10n, 9n, (a, b) => expect(a).not.to.be.lte(b));
    });
  });

  describe('within', () => {
    it('.to.be.within', () => {
      expect(BigInt(100)).to.be.within(BigInt(99), BigInt(101));
    });

    it('.not.to.be.within', () => {
      expect(BigInt(100)).not.to.be.within(BigInt(101), BigInt(102));
      expect(BigInt(100)).not.to.be.within(BigInt(98), BigInt(99));
    });

    it('expect to throw on error', () => {
      expect(() => expect(BigInt(100)).to.be.within(BigInt(80), BigInt(90))).to.throw(
        AssertionError,
        'Expected "100" to be within [80,90]'
      );
      expect(() => expect(BigInt(100)).not.to.be.within(BigInt(99), BigInt(101))).to.throw(
        AssertionError,
        'Expected "100" NOT to be within [99,101]'
      );
    });
  });

  describe('closeTo', () => {
    it('.to.be.closeTo', () => {
      checkAll(100n, 101n, (a, b) => expect(a).to.be.closeTo(b, 10));
      checkAll(100n, 101n, (a, b) => expect(a).to.be.closeTo(b, BigInt(10)));
    });

    it('.not.to.be.closeTo', () => {
      checkAll(100n, 111n, (a, b) => expect(a).not.to.be.closeTo(b, 10));
      checkAll(100n, 111n, (a, b) => expect(a).not.to.be.closeTo(b, BigInt(10)));
    });

    it('expect to throw on error', () => {
      checkAll(100n, 111n, (a, b) => {
        expect(() => expect(BigInt(a)).to.be.closeTo(BigInt(b), 10)).to.throw(
          AssertionError,
          'Expected "100" to be within 10 of 111'
        );
        expect(() => expect(BigInt(a)).to.be.closeTo(BigInt(b), BigInt(10))).to.throw(
          AssertionError,
          'Expected "100" to be within 10 of 111'
        );
      });
      checkAll(100n, 101n, (a, b) => {
        expect(() => expect(BigInt(a)).not.to.be.closeTo(BigInt(b), 10)).to.throw(
          AssertionError,
          'Expected "100" NOT to be within 10 of 101'
        );
        expect(() => expect(BigInt(a)).not.to.be.closeTo(BigInt(b), BigInt(10))).to.throw(
          AssertionError,
          'Expected "100" NOT to be within 10 of 101'
        );
      });
    });
  });
});
