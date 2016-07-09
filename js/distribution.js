'use strict';

const _ = require('lodash');

module.exports = () => {
  const dist =  Object.create(Distribution);
  dist.data = {};
  dist.times = [];
  return dist;
}

const Distribution = {

  set(time, p) {
    this.data[time] = p;
    const idx = _.sortedIndex(this.times, time);
    this.times.splice(idx, 0, time);
  },

  get(time) {
    return this.data[time];
  },

  [Symbol.iterator]() {
    const self = this;
    let i = 0;
    return {
      next() {
        if( i === self.times.length ) {
          return {done: true, value: null};
        }
        i++;
        return {done: false, value: self.data[self.times[i - 1]]};
      }
    }
  }
}
