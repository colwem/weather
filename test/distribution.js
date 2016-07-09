'use strict';

const chai = require('chai');
const expect = chai.expect;
const distribution = require('../js/distribution');

describe('Distribution', function() {
  let dist;
  beforeEach(function() {
    dist = distribution();
  });

  it('creates', function() {
    const dist = distribution();
    expect(dist).to.be.ok;
  });

  it('sets and gets stuff', function() {
    const dist = distribution();
    dist.set(1, 3);
    expect(dist.get(1)).to.be.equal(3);
  });

  it('iterates in order', function() {
    const a = [1,4,2,3,8];
    const expected = [1,2,3,4,8];
    (a).forEach((i) => {
      dist.set(i, i);
    });
    const values = [];
    for(let v of dist ) {
      values.push(v);
    }

    expect(values).to.be.eql(expected);
  });

  it('substitutes numbers', function() {
    dist.set(1,2);
    dist.set(1,3);
    expect(dist.get(1)).to.be.equal(3);
  });

  it('can exist twice', function() {
    dist.set(1,2);
    const newDist = distribution();
    expect(newDist.get(1)).to.be.undefined;
  });

});

