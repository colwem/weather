"use strict";

var request = require('request');
var urljoin = require('url-join');
var _ = require('lodash');
var async = require('async');

const API_KEY = "4586cd9aa8c8b365";


class ApiUrl {

  constructor() {
    this.apiBaseUrl = "http://api.wunderground.com/api/";
    this._defaults = {
      city: 'arlington',
      state: 'ma',
      dataType: 'json',
      apiKey: API_KEY,
      method: 'conditions'
    }
  }

  getMethod() {
    return this.method ? this.method : this._defaults.method;
  }

  getCity() {
    return this.city ? this.city : this._defaults.city;
  }

  getState() {
    return this.state ? this.state : this._defaults.state;
  }

  getLocationUrl() {
    return urljoin('q', this.getState(), this.getCity());
  }

  getMethod() {
    return this.method ? this.method : this._defaults.method;
  }

  getDataTypeUrl() {
    let d = this.dataType ? this.dataType : this._defaults.dataType;
    return '.' + d
  }

  url() {
    return urljoin(this.apiBaseUrl, API_KEY, this.getMethod(), this.getLocationUrl()) + this.getDataTypeUrl();
  }
}

let apiUrl = new ApiUrl();
apiUrl.method = 'forecast';
console.log("getting: ", apiUrl.url());

function test() {
  request.get(apiUrl.url(), function(err, response, body) {
    if(err) {
      console.log(err);
      throw err;
    }
    debugger;
    console.log(body);
  });
}

test();
