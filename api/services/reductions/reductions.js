const axios = require('axios');
const moment = require('moment');

const get = async (id, config) => {
    const callConfig = {
        auth: {
            username: config.usr,
            password: config.pass
        }};
    const result = await  axios.get(`https://${config.apiHost}/reductions/${id}`, callConfig);
    return  result.data;
};

const calcReduction = (basePrice, reduction) => {
    if(
        reduction.condition_type !== 'ONLINE' ||
        reduction.currency_code !== 'GBP' ||
        !moment().isBetween(reduction.valid_from, reduction.valid_to)
    ) {
        return basePrice;
    }

    if(reduction.discount.discount_type === 'PERCENTAGE') {
        const percentageOff = parseInt(reduction.discount.discount_value.replace('%', ''));
        // eslint-disable-next-line no-magic-numbers
        return  basePrice *  ((100 - percentageOff)/100);
    }

    if(reduction.discount.discount_type === 'AMOUNT') {
        return basePrice - parseFloat(reduction.discount.discount_value);
    }

    return basePrice;
};

const calc = (basePrice, reductions) => {
    const price = parseFloat(basePrice);
    if(! reductions.length) {
        return price;
    }
    const reductionPrices = reductions.map(reduction => calcReduction(price, reduction));
    return Math.min(...reductionPrices);
};

module.exports = {
    get,
    calc,
    calcReduction
};