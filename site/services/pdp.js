const axios = require('axios');
const configFile = require('../config/env');

const get = async (id) => {
    const config = configFile.get();
    const result = await axios.get(`${config.apiHost}/pdp/${id}`);
    return  result.data;
};

module.exports = {
    get
};