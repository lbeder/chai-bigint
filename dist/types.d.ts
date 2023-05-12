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
