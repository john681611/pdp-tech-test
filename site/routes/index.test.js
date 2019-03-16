const pdpService = require('../services/pdp');
const pdpHandler = require('./index');

const resStub = {
    render: sinon.stub(),
    status: sinon.stub()
};

const reqStub = {
    params: {}
};


describe('pdp', () => {

    const serverStub = {
        get: async (pattern, callback) => {
            await callback(reqStub, resStub);
        }
    };

    beforeEach(() => {
        sinon.spy(serverStub, 'get');
        sinon.stub(pdpService, 'get').returns('bla');
    });

    afterEach(() => {
        resStub.render.reset();
        resStub.status.reset();
        reqStub.params = {};
        serverStub.get.restore();
        pdpService.get.restore();
    });

    it('should have pattern of /pdp/:productId', async() => {
        await pdpHandler(serverStub);
        expect(serverStub.get).to.be.calledWith('/pdp/:productId');
    });

    it('should respond with response from pdpService.get', async () => {
        reqStub.params.productId ='123';
        await pdpHandler(serverStub);
        expect(pdpService.get).to.be.calledWith(reqStub.params.productId);
        expect(resStub.render).to.be.calledWith('index', 'bla');
    });

    it('should respond 404 for missing product', async () => {
        reqStub.params.productId ='124';
        pdpService.get.throws({response: {status:404}});
        await pdpHandler(serverStub);
        expect(resStub.status).to.be.calledWith(404);
        expect(resStub.render).to.be.calledWith('notFound');
    });

    it('should respond 500 any other error', async () => {
        reqStub.params.productId ='123';
        pdpService.get.throws({message: 'bang'});
        await pdpHandler(serverStub);
        expect(resStub.status).to.be.calledWith(500);
        expect(resStub.render).to.be.calledWith('error');
    });
});