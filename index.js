"use strict";

var request = require('request');
var url = require('url');
var _ = require('lodash');
var async = require('async');

const API_KEY = "4586cd9aa8c8b365";


class ApiUrl {

  constructor() {

    this.apiBaseUrl = "http://api.wunderground.com/api/";
    this.locationUrl = "MA/arlington";
  }

  url() {
    return url.resolve(this.apiBaseUrl, API_KEY, this.method, this.locationUrl);
  }
}

let apiUrl = new ApiUrl();
apiUrl.method = 'conditions';

console.log("getting: ", apiUrl.url());
// request.get(apiUrl.url()).onResponse(function(response){
  // console.log(response);
// }).on('error', function(err) {
  // console.log(err);
// })
