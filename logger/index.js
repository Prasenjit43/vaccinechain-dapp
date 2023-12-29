const devLogger = require('./devLogger.js')

module.exports = function (callingModule) {
    return devLogger(callingModule);
};
