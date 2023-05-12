/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */

/// <reference types="chai" />

declare namespace Chai {
  interface NumberComparer {
    (value: any, message?: string): Assertion;
  }

  interface NumericComparison {
    within(start: any, finish: any, message?: string): Assertion;
  }

  interface CloseTo {
    (expected: any, delta: any, message?: string): Assertion;
  }
}
