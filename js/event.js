'use strict';

const _ = require('lodash'),
      I = require('immutable');

const createEvent = (name, n) => {
  const event = Object.create(Event);
  event.times = _.range(0, n);
  event.name = name;
  return event;
}

const Event = {

};

module.exports = createEvent;
