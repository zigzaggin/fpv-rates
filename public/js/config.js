var require = {
    "baseUrl": "js",
    "paths": {
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        "handlebars": "_lib/handlebars",
        "text": "_lib/text",
        "profile-handler": "_modules/profile-handler"
    },
    shim: {
        handlebars: {
            exports: 'Handlebars'
        }
    },
    packages: [
        {
            name: 'hbs',
            location: '_lib/hbs',
            main: 'hbs'
        }
    ],
    hbs: {
        base: "/js/hbs",
        templateExtension: ".hbs"
    }
};
