define(function () {
    return {
        generateID: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        loadProfiles: function () {
            var profiles;
            var fromStorage = localStorage.getItem('profiles');
            if (fromStorage !== null && typeof fromStorage === "object") {
                profiles = JSON.parse(fromStorage).map(function (value) {
                    return {id: value.id, description: value.description}
                });
            } else {
                profiles = [{id: this.generateID(), description: "New Profile"}]
            }

            return profiles;
        },
        loadProfile: function (profileId) {

        }
    };
});