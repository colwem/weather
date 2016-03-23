#!/usr/bin/env node
"use strict";

let request = require('request');
let urljoin = require('url-join');
let _ = require('lodash');
let program = require('commander');
let fs = require('fs');
let async = require('async');
let path = require('path');

let config = require('./config.json');

program
  .version('1.0.0')
  .arguments('blah')
  .option('-C, --Celsius', 'Use celsius temperature scale')
  .option('-F, --Fahrenheit', 'Use fahrenheit temperature scale')
  .option('-f, --filter <s>', 'Filter expression')
  .option('-o, --output <file>', 'File to output json response from wunderground api')
  .option('-i, --input <file>', 'json file to use instead of wunderground api')
  .parse(process.argv)


class ApiUrl {

  constructor(api, config) {
    this.api = api;
    this.config = config;
    this._defaults = {
      api: 'wunderground',
      city: 'arlington',
      state: 'ma',
      dataType: 'json',
      key: config.apis[api].key,
      baseUrl: config.apis[api].url,
      method: 'forecast10day'
    }
  }

  getLocationUrl() {
    return urljoin('q', this.get('state'), this.get('city'));
  }

  get(key) {
    return this[key] ? this[key] : this._defaults[key];
  }

  getDataTypeUrl() {
    return '.' + this.get('dataType');
  }

  url() {
    if(this.api === 'wunderground') return this.wuUrl();
    if(this.api === 'openWeatherMap') return this.owmUrl();
  }

  wuUrl() {
    return urljoin(this.get('baseUrl'), this.get('key'), this.get('method'), this.getLocationUrl()) + this.getDataTypeUrl();
  }

  owmUrl() {
    return urljoin(this.get('baseUrl'), this.get('key'), this.get('method'), this.getLocationUrl()) + this.getDataTypeUrl();
  }
}

class Base {
  constructor(f) {
    if( ! f ) return;
    this.filters = f.constructor === 'Array' ? f : [f];
  }

  process(w) {
    console.log('Base.process');
    _(this.filters).forEach(f => {
      w = f.process(w);
    }); 
    return w;
  }

  days(w) { 
    return w;
  }
}

class EachDay extends Base {
  
}

class Weekday extends Base {
  process(w) {
    w = super.process(w);
    return _(this.days(w)).map(d => d.weekday);
  }
}

class First extends Base{ 

  process(w) {
    console.log('First.process');
    w = super.process(w);
    return this.days(w)[0];
  }
}

class Days extends Base {
  constructor(filters) {
    super(filters);
  }

  process(w) {
    console.log('Days.process');
    w = super.process(w); 
    return this.days(w).length;
  }
}

class Th extends Base {

  constructor(low, high) {
    super();
    this.low = low;
    this.high = high ? high : 200;
  }

  process(w) {
    console.log('Th.process');
    w = _(this.days(w)).filter(d => {
      return d.high.fahrenheit > this.low && d.high.fahrenheit < this.high;
    }).value(); 
    debugger;
    return w;
  }
}

let apiUrl = new ApiUrl();
apiUrl.key = config.apiKeys.openWeatherMap;
apiUrl.method = 'forecast10day';

if( program.output ) {
  request.get(apiUrl.url()).pipe(fs.createWriteStream(program.output));
} else if( program.input ) {
  run(require('./' + program.input));
} else {
  request.get(apiUrl.url(), (err, response, body) => {
    if(err) {
      console.log(err);
      throw err;
    }
    run(body);
  });
}

function run(w) {
  w = w.forecast.simpleforecast.forecastday;
  let prog = new Days( new Th(40, 80));
  console.log(prog.process(w));
}

