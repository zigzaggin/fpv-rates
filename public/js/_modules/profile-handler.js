define(['jquery'], function ($) {
    var STORAGE_KEY = 'profiles';
    var fromStorage = function () {
        var fromStorage = localStorage.getItem(STORAGE_KEY);
        if (fromStorage !== null) {
            return JSON.parse(fromStorage);
        }
        return [];
    };
    var store = function (profiles) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    };
    var addToStorage = function (profileShell) {
        var profiles = fromStorage();
        profiles.unshift(profileShell);
        store(profiles);
    };
    var generateID = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    return {
        loadProfiles: function () {
            var profiles = fromStorage();
            if (profiles.length === 0) {
                this.generateProfile();
                profiles = fromStorage();
            }

            return profiles;
        },
        generateProfile: function () {
            var profileShell = {id: generateID(), description: "New Profile"};
            addToStorage(profileShell);
            return profileShell;
        },
        loadProfile: function (profileId) {
            return $.grep(fromStorage(), function (e) {
                return e.id === profileId
            })[0];
        },
        removeProfile: function (profileId) {
            var profiles = fromStorage();

            var index = profiles.findIndex(function (value) {
                return value.id === profileId;
            });
            profiles.splice(index, 1);

            store(profiles);
        },
        persist: function (obj) {
            var profiles = fromStorage();

            var index = profiles.findIndex(function (value) {
                return value.id === obj.id;
            });

            profiles[index] = obj;

            store(profiles);
        }
    };
});