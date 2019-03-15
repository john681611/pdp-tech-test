const productCompiler = require('../services/productCompiler/productCompiler');

module.exports = server => {
    server.get('/pdp/:productId', async(req, res) => {
        try {
            const product = await productCompiler.getProduct(req.params.productId);
            res.send(product);
        } catch (error) {
            if(error.status === 404) {
                res.status(404);
                res.send('Not found');
            } else {
                res.status(500);
                res.send('Something has gone wrong');
                // eslint-disable-next-line no-console
                console.error(error);
            }
        }
    });
};