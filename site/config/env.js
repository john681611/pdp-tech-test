module.exports = {
    get: () => {
        return {
            apiHost:  process.env.APIHOST,
            usr: process.env.USR,
            pass: process.env.PASS
        };
    }
};