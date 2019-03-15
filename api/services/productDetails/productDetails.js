const axios = require('axios');

const get = async (id, config) => {
    const callConfig = {
        auth: {
            username: config.usr,
            password: config.pass
        }
    };
    const result = await  axios.get(`https://${config.apiHost}/products/${id}`, callConfig);
    return  result.data;
};

module.exports = {
    get
};