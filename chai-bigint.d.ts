/// <reference types="chai" />

declare module 'chai-bigint' {
  const chaiBigInt: Chai.ChaiPlugin;
  export = chaiBigInt;
}

declare global {
  export namespace Chai {
    export interface BigIntComparer extends NumberComparer {
      (value: bigint | string, message?: string): BigIntAssertion;
    }

    export interface BigIntCloseTo extends CloseTo {
      (value: bigint | string, delta: bigint | string, message?: string): BigIntAssertion;
    }

    export interface Assertion {
      bigint: BigIntAssertion;
    }

    export interface BigIntAssertion extends Assertion {
      equal: BigIntComparer;
      equals: BigIntComparer;
      eq: BigIntComparer;
      above: BigIntComparer;
      greaterThan: BigIntComparer;
      gt: BigIntComparer;
      gte: BigIntComparer;
      below: BigIntComparer;
      lessThan: BigIntComparer;
      lt: BigIntComparer;
      lte: BigIntComparer;
      least: BigIntComparer;
      most: BigIntComparer;
      closeTo: BigIntCloseTo;
      negative: Assertion;
      zero: Assertion;
    }
  }
}
