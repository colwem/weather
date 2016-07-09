'use strict';

const chai = require('chai'),
      expect = chai.expect,
      _ = require('lodash'),
      I = require('immutable'),
      Constraint = require('../js/constraint'),
      Schedule = require('../js/schedule'),
      Event = require('../js/event.js');


describe('schedule', function() {

  it('create adjacenty list', function() {
    const events = ['A', 'B', 'C', 'D'];
    const constraints = constraintsFromList(events);
    const schedule = Schedule();
    schedule.addConstraints(constraints);
    const adjList = schedule.buildAdjacencyList(constraints);
  });

  it.only('#mergeConstraintList', function() {

    const events = ['A', 'B', 'C'];
    const list = constraintsFromList(events);
    const constraints = I.Set(list);
    const schedule = Schedule();

    const mergedConstraint = schedule.mergeConstraintList(constraints);
    console.log(mergedConstraint);
  });

});

function constraintsFromList(list) {
  const n = 3;
  return pairs(list).map(([a, b]) => {
    const ae = Event(a, n),
          be = Event(b, n),
          rule = (a, b) => a !== b;

    return Constraint.simple(ae, be, rule);
  });
}

describe('pairs', function() {

  it('works', function() {
    const given = [1,2,3,4];
    const expected = [ [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 4 ], [ 3, 4 ] ];
    expect(pairs(given)).to.eql(expected);
  });

});

function pairs(list) {
  if( !list.length ) return []

  const first = _.first(list);
  const tail = _.tail(list);
  return tail.map(e => [first, e]).concat(pairs(tail));
}

describe('maxCount', function() {

  it('works', function() {
    const v = Schedule.maxCount([1,2,2,2,3]);
    const w = Schedule.maxCount([1,2,3]);
    const x = Schedule.maxCount([1]);
    const y = Schedule.maxCount([]);
    const z = Schedule.maxCount([1,1,2,2,2,3,3]);
    console.log('v: ', v);
    console.log('w: ', w);
    console.log('x: ', x);
    console.log('y: ', y);
    console.log('z: ', z);

  });

});
