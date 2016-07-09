'use strict';

const _ = require('lodash'),
      I = require('immutable'),
      Constraint = require('./constraint');

const createSchedule = () => {
  const schedule = Object.create(Schedule);
  schedule.events = [];
  schedule.constraints = [];
  schedule.autoCompute = true;

  return schedule;
}

const Schedule = {

  addEvent(event) {
    this.events.push(event);
    // this._compute();
  },

  addConstraint(constraint) {
    this.constraints.push(constraint);
    // this._compute();
  },

  addConstraints(constraints) {
    this.constraints = this.constraints.concat(constraints);
  },

  buildAdjacencyList(constraints) {
    const list = Array(constraints.length).fill(0).map(d => []);
    for(let i = 0; i < constraints.length; i++) {
      for(let j = i + 1; j < constraints.length; j++) {
        constraints[i].events.forEach((event) => {
          if( _.includes(constraints[j].events, event) ) {
            list[i].push(j);
            list[j].push(i);
          }
        });
      }
    }

    return list;
  },

  pickMergers(constraints) {
    constraints = constraints.sort( d => d.possibleFutures.length);
    let inner = constraints,
        max = -1,
        a = undefined,
        b = undefined;
    constraints.forEach((v,k,i) => {
      inner = inner.delete(v);
      inner.forEach((w,l,j) => {
        const n = commonColumns(v.possibleFutures, w.possibleFutures).length;
        if( n > max ) {
          max = n;
          a = v;
          b = w;
        }
      });
    });

    return a && b ? [a, b] : undefined;
  },

  mergeConstraintList(constraints) {
    let a, b, pair;

    while( pair = this.pickMergers(constraints)) {
      [a, b] = pair;
      const ab = this.mergeConstraints(a, b);
      constraints = constraints.add(ab);
      constraints = constraints.delete(a);
      constraints = constraints.delete(b);
    }
    return constraints.last();
  },

  // Cartesian inner join on all common columns.
  joinOnAll(t1, t2) {
    const columns = commonColumns(t1, t2);
    return this.join(t1, t2, columns);
  },

  // Cartesian inner join on columns
  join(t1, t2, columns) {
    let t3 = I.List();
    t1 = t1.sort(compareOnKeys.bind(null, columns));
    t2 = t2.sort(compareOnKeys.bind(null, columns));

    let b1 = 0,
        b2 = 0;

    while(b1 < t1.size && b2 < t2.size) {
      const r1 = t1.get(b1);
      const v = _.pick(r1, columns);

      b2 = t2.findIndex( r2 => equalOnKeys(columns, r1, r2));

      let i = b2;
      while(i < t2.size && equalOnKeys(columns, r1, t2.get(i))) {
        t3 = t3.push(_.assign(_.clone(r1), t2.get(i)));
        i++;
      }
      b1++;
    }
    return t3;
  },

  mergeConstraints(a, b) {
    const events = _.unionBy(a.events, b.events, 'name'),
          possibleFutures = this.joinOnAll(a.possibleFutures, b.possibleFutures);
    const ab = Constraint.constructed(events, possibleFutures);
    return ab;
  }

}

function replaceAll(list, values, replace) {
  return list.map((d) => _.includes(values, d) ? replace : d);
}

function maxCount(d) {
  let count = 0,
      max = 0,
      value = undefined,
      p = undefined;

  _.sortBy(d).forEach((e) => {
    if(e !== p) {
      count = 0;
      p = e;
    }
    count++;
    if( count > max ) {
      max = count;
      value = e;
    }
  });
  return [max, value];
}

function equalOnKeys(keys, o1, o2) {
  for(let key of keys) {
    if( o1[key] !== o2[key] ) return false;
  }
  return true;
}

function compareOnKeys(keys, o1, o2) {
  if( ! keys.length ) return 0;
  if( o1[keys[0]] == o2[keys[0]] ) return compareOnKeys(_.tail(keys), o1, o2);

  return o1[keys[0]] < o2[keys[0]] ? -1 : 1;
}

function commonColumns(t1, t2) {
  return commonKeys(t1.get(0), t2.get(0));
}

function commonKeys(o1, o2) {
  return _.intersection(_.keys(o1), _.keys(o2));
}

createSchedule.maxCount = maxCount;
createSchedule.equalOnKeys = equalOnKeys;

module.exports = createSchedule;
