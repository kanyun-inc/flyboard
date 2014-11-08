var app = angular.module('exampleApp', ['ngNumeraljs']);

app.config(['$numeraljsConfigProvider', function ($numeraljsConfigProvider) {
    var language = {
        delimiters: {
            thousands: ' ',
            decimal: ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            return '.';
        },
        currency: {
            symbol: '€'
        }
    };

    $numeraljsConfigProvider.setDefaultFormat('0,0.00');

    $numeraljsConfigProvider.setFormat('currency', '$ 0,0.00');
    $numeraljsConfigProvider.setFormat('currencySuffix', '0,0.00 $');
    $numeraljsConfigProvider.setFormat('number', '0.00');
    $numeraljsConfigProvider.setLanguage('de', language);

    $numeraljsConfigProvider.setCurrentLanguage('de');
}]);

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