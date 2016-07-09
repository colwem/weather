'use strict';

const chai = require('chai');
const expect = chai.expect;
const events = require('../web/public/js/events.js');

describe('product', function() {

  it('creates a product', function() {
    let test = [[1,2,3], ['a', 'b', 'c'], [5, 6, 7]];

    let prod = events.product(test);
    console.log(prod);

  });

});
