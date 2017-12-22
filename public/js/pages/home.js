requirejs(
    [
        'jquery',
        'profile-handler',
        'hbs!pages/home/rail',
        'hbs!pages/home/content'
    ],
    function ($, Handler, rail, content) {
        $(function () {
            var page = $("#home-page-target");

            var renderRail = function () {
                var profiles = Handler.loadProfiles();
                page.find("[data-rail-target]").html(rail({profiles: profiles}));
            };

            renderRail();

        });
    });