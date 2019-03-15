const pdpService = require('../services/pdp');

module.exports = server => {
    server.get('/pdp/:productId', async(req, res) => {
        try {
            const result = await pdpService.get(req.params.productId);
            res.render('index', result);
        } catch (error) {
            if(error.response && error.response.status === 404) {
                res.status(404);
                res.render('notFound');
            } else {
                res.status(500);
                res.render('error');
                // eslint-disable-next-line no-console
                console.error(error);
            }
        }
    });
};

