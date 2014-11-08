# Angular Numeral.js filter

This is an Angular.js filter that applies [Numeral.js](http://numeraljs.com/) formatting.

## How to Use

1. Include Numeral.js in your project

2. Include either the minified or non-minified javascript file from the `/dist/` folder:

    ```html
    <script src="angular-numeraljs.js"></script>
    ```

3. Inject the `ngNumeraljs` filter into your app module:

    ```javascript
    var myApp = angular.module('myApp', ['ngNumeraljs']);
    ```

4. Apply the filter with the desired format string:
    ```html
    <p>
        {{ price | numeraljs:'$0,0.00' }}
    </p>
    ```

## Advanced Usage

You can configure `ngNumeraljs` during Angular's configuration phase using the $numeraljsConfigProvider:

```js
var app = angular.module('exampleApp', ['ngNumeraljs']);

app.config(['$numeraljsConfigProvider', function ($numeraljsConfigProvider) {
    // place configuration here
}]);
```

Numeral.js must be already loaded in the browser prior to using `$numeraljsConfigProvider`.

### Named Formats

`$numeraljsConfigProvider.setFormat(name, formatString)` - defines a named format which can be used in place of the format string in the filter.

```js
app.config(['$numeraljsConfigProvider', function ($numeraljsConfigProvider) {
    $numeraljsConfigProvider.setFormat('currency', '$ 0,0.00');
}]);
```

In markup,

```html
<p>
    {{ price | numeraljs:'currency' }}
</p>
```

### Default Format

Numeral.js defines the default format as '0,0', so this format is used if none is provided to the filter.

`$numeraljsConfigProvider.setDefaultFormat(format)` - overrides the built-in default format.

```js
app.config(['$numeraljsConfigProvider', function ($numeraljsConfigProvider) {
    $numeraljsConfigProvider.setDefaultFormat('0.0 $');
}]);
```

In markup,

```html
<p>
    {{ price | numeraljs }}     <!-- will produce 15.5 $ -->
</p>
```

### Custom Languages

`$numeraljsConfigProvider.setLanguage(langId, definition)` - adds new language definitions to Numeral.js. See the available list here: [languages](https://github.com/adamwdraper/Numeral-js/tree/master/languages).  

```js
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

    $numeraljsConfigProvider.setLanguage('de', language);
}]);
```

Languages can be loaded directly into Numeral.js as well, e.g. by loading the [language files](https://github.com/adamwdraper/Numeral-js/tree/master/languages) after Numeral.js is loaded.  Angular-numeraljs can use these languages even if they are not set via this provider.

### Select Language

`$numeraljsConfigProvider.setCurrentLanguage(langId)` - selects the current language.  The language must be loaded either by `$numeraljsConfigProvider.setLanguage()` or by loading the Numeral.js language file.

```js
app.config(['$numeraljsConfigProvider', function ($numeraljsConfigProvider) {
    $numeraljsConfigProvider.setCurrentLanguage('de');
}]);
```

## Examples

Check out [example/simple](example/js/app.js) and [example/config](config/js/app.js) for reference.

## Bower

This filter can be installed via Bower with the following dependency in the `bower.json` file.

    "dependencies": {
        "angular-numeraljs": "^1.0"
    }

## Browserify

This project is published in NPM as `angular-numeraljs`.

    "dependencies": {
        "angular-numeraljs": "^1.0"
    }

The `example/browserify` folder has a working example with Browserify and Grunt.  To build this project, install [Grunt](http://gruntjs.com/) and [Browserify](http://browserify.org/) and run the following:
    
    cd example/browserify
    npm install
    grunt build

Then open `example/browserify/dist/index.html` in a browser.

# Building

1. Install [Grunt CLI](http://gruntjs.com/getting-started) and [Node.js](http://nodejs.org/)

2. Install Node packages

        npm install

3. Build via Grunt

        grunt build

    The `/dist/` folder contains the regular and minified Javascript files.

4. Tests are automatically run during the build, but they can be run manually as well

        grunt test

