define(function () {
    var midRc = 1500;

    var constrain = function (value, min, max) {
        return Math.max(min, Math.min(value, max));
    };
    var rcCommand = function (rcData, rcRate, deadband) {
        var tmp = Math.min(Math.max(Math.abs(rcData - midRc) - deadband, 0), 500);

        var result = tmp * rcRate;

        if (rcData < midRc) {
            result = -result;
        }

        return result;
    };

    var rcCommandRawToDegreesPerSecond = function (rate, rcRate, rcExpo, superExpoActive) {
        var angleRate;
        if (rate !== undefined && rcRate !== undefined && rcExpo !== undefined) {
            if (rcRate > 2) {
                rcRate = rcRate + (rcRate - 2) * 14.54;
            }

            var inputValue = rcCommand(2000, rcRate, 0);
            var maxRc = 500 * rcRate;

            var expoPower;
            var rcRateConstant;
            expoPower = 3;
            rcRateConstant = 200;

            if (rcExpo > 0) {
                var absRc = Math.abs(inputValue) / maxRc;
                inputValue = inputValue * Math.pow(absRc, expoPower) * rcExpo + inputValue * (1 - rcExpo);
            }

            var rcInput = inputValue / maxRc;

            if (superExpoActive) {
                var rcFactor = 1 / constrain(1 - Math.abs(rcInput) * rate, 0.01, 1);
                angleRate = rcRateConstant * rcRate * rcInput; // 200 should be variable checked on version (older versions it's 205,9)
                angleRate = angleRate * rcFactor;
            } else {
                angleRate = (((rate * 100) + 27) * inputValue / 16) / 4.1; // Only applies to old versions ?
            }

            angleRate = constrain(angleRate, -1998, 1998); // Rate limit protection
        }

        return angleRate;
    };

    return function (rcRate, superRate, expo) {
        return Math.round(rcCommandRawToDegreesPerSecond(parseFloat(superRate), parseFloat(rcRate), parseFloat(expo), true));
    };
});