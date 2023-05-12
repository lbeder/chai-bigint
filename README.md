# chai-bigint

[![NPM Package](https://img.shields.io/npm/v/lbeder/chai-bigint.svg)](https://www.npmjs.org/package/lbeder/chai-bigint)
[![Test](https://github.com/lbeder/chai-bigint/actions/workflows/ci.yml/badge.svg)](https://github.com/lbeder/chai-bigint/actions/workflows/ci.yml)

[`Chai`](https://www.chaijs.com/) assertions for comparing arbitrary-precision integers using the native `bigint` type. Adapted from [chai-bn](https://github.com/OpenZeppelin/chai-bn).

## Installation

```sh
yarn add chai-bigint --dev
```

OR

```sh
npm install chai-bigint --save-dev
```

## Usage

```javascript
const chai = require('chai');

chai.use(require('chai-bigint'));
```

## Assertions

The following assertion methods are provided and will override the existing builtin assertions if the `bigint` property is set as part of the assertion chain:

- equal/equals/eq
- above/gt/greaterThan
- least/gte
- below/lt/lessThan
- most/lte
- closeTo

A set of additional assertion properties is also provided:

- negative
- zero

Both actual values (the values being asserted) and expected values (the values the actual value is expected to match) can be either instances of `bigint`, or strings which can be converted into a valid number.

Only BDD style (`expect` or `should`) assertions are supported.

## Examples

Methods:

```javascript
const actual = 100000000000000000n + 1n;
const expected = 100000000000000001n;

actual.should.be.a.bigint.that.equals(expected);
expect(actual).to.be.a.bigint.that.is.at.most(expected);
BigInt(1000).should.be.a.bigint.that.is.lessThan('2000');
```

Properties:

```javascript
expect(-100n).to.be.a.bigint.that.is.negative;
expect(0n).to.be.a.bigint.that.is.zero;
```

Some `Chai` properties (e.g. the `that.is` chain) have no effect other than increasing readability, and can be dropped if less verbosity is desired.

## License

`chai-bn` is open source and distributed under the MIT License (see [`LICENSE`](./LICENSE)).
