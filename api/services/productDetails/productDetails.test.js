const productDetailsService = require('./productDetails');
const nock = require('nock');
const productMock = require('./productDetails.mock');
const config = {
    apiHost:'bob.com',
    usr: 'usr',
    pass: 'pass'
};
describe('productDetailsService', () => {

    afterEach(() => {
        nock.cleanAll();
    });

    it('should return json product details', async () => {
        nock(`https://${config.apiHost}`)
            .get('/products/p60107258')
            .reply(200, productMock);
        const result = await productDetailsService.get('p60107258', config);
        expect(result).to.deep.eql(productMock);
    });

    it('should fail and return 404 status if bad product code passed', async () => {
        nock(`https://${config.apiHost}`)
            .get('/products/nahh')
            .reply(404, 'notFound');
        try {
            await productDetailsService.get('nahh', config);
        } catch (error) {
            expect(error.response.status).to.eql(404);
        }
    });

    it('should fail and return 500 status if error an occurred on server side', async () => {
        nock(`https://${config.apiHost}`)
            .get('/products/bang')
            .reply(500, 'bang');
        try {
            await productDetailsService.get('bang', config);
        } catch (error) {
            expect(error.response.status).to.eql(500);
            expect(error.response.data).to.eql('bang');
        }
    });
});