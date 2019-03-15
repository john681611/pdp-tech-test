const pricesService = require('../prices/prices');
const productDetailsService = require('../productDetails/productDetails');
const reductionsService = require('../reductions/reductions');
const configFile = require('../../config/env');


const getPrice = async (sku, config) => {
    let basePrice, reduction;
    try {
        basePrice = await pricesService.get(sku, config);
        reduction = await reductionsService.get(sku, config);
    } catch (error) {
        throw error;
    }

    return reductionsService.calc(basePrice.amount, reduction);
};

const getPrices = (colours, config) => {
    const promises = colours.map(async colour => {
        try {
            colour.sizes = await Promise.all(colour.sizes.map(async size => {
                size.price = await getPrice(size.sku_id, config);
                return size;
            }));
        } catch (error) {
            throw error;
        }
        return colour;
    });

    try {
        return Promise.all(promises);
    } catch (error) {
        throw error;
    }
};


const getProduct = async(id) => {
    const config = configFile.get();
    let productBase;
    try {
        productBase = await productDetailsService.get(id, config);
        productBase.colours = await getPrices(productBase.colours, config);
    } catch (error) {
        if(error.response && error.response.status === 404) {
            throw {status: 404};
        }
        throw error;
    }
    return productBase;
};
module.exports = {
    getProduct,
    getPrices,
    getPrice
};