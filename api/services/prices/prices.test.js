const pricesService = require('./prices');
const nock = require('nock');
const priceMock = require('./prices.mock');
const config = {
    apiHost:'bob.com',
    usr: 'usr',
    pass: 'pass'
};
describe('pricesService', () => {

    afterEach(() => {
        nock.cleanAll();
    });

    it('should return json price information', async () => {
        nock(`https://${config.apiHost}`)
            .get('/prices/08237408')
            .reply(200, priceMock);
        const result = await pricesService.get('08237408', config);
        expect(result).to.deep.eql(priceMock);
    });

    it('should fail and return 404 status if bad sku code passed', async () => {
        nock(`https://${config.apiHost}`)
            .get('/prices/nahh')
            .reply(404, 'notFound');
        try {
            await pricesService.get('nahh', config);
        } catch (error) {
            expect(error.response.status).to.eql(404);
        }
    });

    it('should fail and return 500 status if error an occurred on server side', async () => {
        nock(`https://${config.apiHost}`)
            .get('/prices/bang')
            .reply(500, 'bang');
        try {
            await pricesService.get('bang', config);
        } catch (error) {
            expect(error.response.status).to.eql(500);
            expect(error.response.data).to.eql('bang');
        }
    });
});