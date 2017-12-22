requirejs(
    [
        'jquery',
        'profile-handler',
        'hbs!pages/home/rail',
        'hbs!pages/home/content',
        'hbs!pages/home/cli',
        'serialize-object',
        'handlebars',
        'rate-math'
    ],
    function ($, Handler, rail, content, cli, so, HB, RateMath) {
        $(function () {
            HB.registerHelper("multiply", function (a, b) {
                return Math.round(Number(a) * Number(b));
            });
            HB.registerPartial("cli", cli);
            var page = $("#home-page-target");

            var activateProfile = function (id) {
                var profile = Handler.loadProfile(id);
                page.find("[data-content-target]").html(content($.extend({}, profile, {
                    profiles: [0, 1, 2].map(function (value) {
                        return {value: value, label: "Profile " + (value + 1), selected: profile.profile === (value + "")}
                    })
                })));
                page.find("[data-profile]").removeClass("active");
                page.find("[data-profile='" + id + "']").addClass("active");

                page.find("[data-rc]").trigger("keyup");
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

            var persist = function () {
                var obj = page.find("[data-content-target]").serializeObject();
                Handler.persist(obj);
            };

            page.on("click", "[data-add-profile]", addProfile);
            page.on("click", "[data-profile] > span", function (e) {
                var profile = $(this).parents("[data-profile]");
                activateProfile(profile.data("profile"));
            });
            page.on("click", "[data-remove-profile]", removeProfile);
            var changeBinding = "[data-content-target] input, [data-content-target] select";
            page.on("keyup change", changeBinding, persist);

            page.on("keyup change", changeBinding, function () {
                var id = page.find("[data-content-target] [name='id']").val();
                page.find("[data-cli-target]").val(cli(Handler.loadProfile(id)));

                page.find(".rate").each(function (i, e) {
                    var me = $(e);
                    var rc = me.find("[data-rc]");
                    var rc = rc.length === 0 ? page.find("[data-pitch-rc]").val() : rc.val();
                    var sr = me.find("[data-super]").val();
                    var ex = me.find("[data-expo]").val();

                    me.find("[data-degs]").val(RateMath(rc, sr, ex) + " degs/s");
                });
            });

            page.on("keyup", "[data-content-target] [name='description']", function () {
                var me = $(this);
                var id = page.find("[data-content-target] [name='id']").val();
                page.find("[data-profile='" + id + "'] span").text(me.val());
            });
            page.on("click", "[data-cli-target]", function () {
                $(this).focus().select();
            });

            renderRail();
        });
    });