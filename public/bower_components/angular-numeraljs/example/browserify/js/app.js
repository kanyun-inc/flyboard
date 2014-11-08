'use strict';

/* Include Angular via Browserify */
require('angular/angular');

window.numeral = require('numeral');
require('angular-numeraljs/dist/angular-numeraljs');

var app = angular.module('exampleApp', ['ngNumeraljs']);

app.controller('numeralExample', function ($scope) {
    $scope.formats = [{
        name: 'Default Format',
    }, {
        name: 'Number',
        format: '0,0'
    }, {
        name: 'Currency',
        format: '$0,0.00'
    },{
        name: 'Bytes',
        format: '0b'
    }, {
        name: 'Percentages',
        format: '0.0%'
    }, {
        name: 'Time',
        format: '00:00:00'
    }];
});