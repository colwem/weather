'use strict';

const _ = require('lodash'),
      I = require('immutable'),
      Constraint = require('./js/constraint'),
      Schedule = require('./js/schedule'),
      Event = require('./js/event.js');


const n = 20;
const events = ['A', 'B', 'C'];
const list = constraintsFromList(events, n);
const constraints = I.Set(list);
const schedule = Schedule();
const mergedConstraint =
  profile('p' + Date.now(), () => schedule.mergeConstraintList(constraints));

console.log('[web.js: 17] mergedConstraint: ', mergedConstraint);
console.log('[web.js: 19] mergedConstraint.possibleFutures.size: ', mergedConstraint.possibleFutures.size);

function constraintsFromList(list, n) {
  return pairs(list).map(([a, b]) => {
    const ae = Event(a, n),
          be = Event(b, n),
          rule = (a, b) => a !== b;

    return Constraint.simple(ae, be, rule);
  });
}

function profile(name, f) {
  if (window.console && window.console.profile) {
    console.profile(name);
    const r = f();
    console.profileEnd();
    return r;
  }
}

function pairs(list) {
  if( !list.length ) return []

  const first = _.first(list);
  const tail = _.tail(list);
  return tail.map(e => [first, e]).concat(pairs(tail));
}
