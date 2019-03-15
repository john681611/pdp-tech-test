const pdpService = require('./pdp');
const nock = require('nock');
const pdpMock = require('./pdp.mock');
const configFile = require('../config/env');
const config = {
    apiHost:'https://bob.com'
};
describe('pdpService', () => {

    beforeEach(() => {
        sinon.stub(configFile, 'get').returns(config);
    });

    afterEach(() => {
        configFile.get.restore();
        nock.cleanAll();
    });

    it('should return json product details', async () => {
        nock(`${config.apiHost}`)
            .get('/pdp/p08237408')
            .reply(200, pdpMock);
        const result = await pdpService.get('p08237408');
        expect(result).to.deep.eql(pdpMock);
    });

    it('should fail and return 404 status if bad product code passed', async () => {
        nock(`${config.apiHost}`)
            .get('/pdp/nahh')
            .reply(404, 'notFound');
        try {
            await pdpService.get('nahh');
        } catch (error) {
            expect(error.response.status).to.eql(404);
        }
    });

    it('should fail and return 500 status if error an occurred on server side', async () => {
        nock(`${config.apiHost}`)
            .get('/pdp/bang')
            .reply(500, 'bang');
        try {
            await pdpService.get('bang');
        } catch (error) {
            expect(error.response.status).to.eql(500);
            expect(error.response.data).to.eql('bang');
        }
    });
});