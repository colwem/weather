'use strict';

const _ = require('lodash'),
      I = require('immutable');

const createConstraint = (events, rules, possibleFutures) => {
  const constraint = Object.create(Constraint);
  constraint.events = events;
  constraint.rules = rules;
  constraint.possibleFutures = possibleFutures;

  return constraint
};

createConstraint.simple = (a, b, rule) => {
  const constraint = createConstraint([a,b], [rule], []);
  constraint.buildPossibleFutures();
  return constraint;
},

createConstraint.constructed = (events, possibleFutures) => {
  return createConstraint(events, [], possibleFutures);
}

const Constraint = {

  addEvent(event) {
    this.events.push(event);
  },

  addEvents(events) {
    this.events = this.events.concat(events);
  },

  testRules(a, b) {
    return this.rules.every(r => r(a, b));
  },

  buildPossibleFutures() {
    this.possibleFutures = this._buildPossibleFutures();
  },

  _buildPossibleFutures() {
    const a = this.events[0],
          b = this.events[1];

    let t = _.flatMap(a.times, (ta) => {
      return _.compact( b.times.map((tb) => {
        if( this.testRules(ta, tb) ) {
          const row = {};
          row[a.name] = ta;
          row[b.name] = tb;
          return row;
        }
      }));
    });

    t = I.List(t);
    return t;
  }

}

module.exports = createConstraint;
