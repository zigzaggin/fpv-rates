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

            var activateProfile = function (id) {
                var profile = Handler.loadProfile(id);
                page.find("[data-content-target]").html(content(profile));
                page.find("[data-profile]").removeClass("active");
                page.find("[data-profile='" + id + "']").addClass("active");
            };

            var renderRail = function () {
                var profiles = Handler.loadProfiles();
                page.find("[data-rail-target]").html(rail({profiles: profiles}));
                activateProfile(profiles[0].id);
            };

            var addProfile = function () {
                var generated = Handler.generateProfile();
                renderRail();
                activateProfile(generated.id);
            };

            var removeProfile = function () {
                var me = $(this);
                var parent = me.parents("[data-profile]");
                var id = parent.data("profile");
                var currentActive = page.find("[data-profile].active").data("profile");
                Handler.removeProfile(id);
                parent.remove();

                renderRail();

                if (page.find("[data-profile='" + currentActive + "']").length > 0)
                    activateProfile(currentActive);
            };

            page.on("click", "[data-add-profile]", addProfile);
            page.on("click", "[data-profile] > span", function (e) {
                var profile = $(this).parents("[data-profile]");
                activateProfile(profile.data("profile"));
            });
            page.on("click", "[data-remove-profile]", removeProfile);

            renderRail();
        });
    });