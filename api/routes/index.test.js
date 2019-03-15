const productCompiler = require('../services/productCompiler/productCompiler');
const pdpHandler = require('./index');

const resStub = {
    send: sinon.stub(),
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
        sinon.stub(productCompiler, 'getProduct').returns('bla');
    });

    afterEach(() => {
        resStub.send.reset();
        resStub.status.reset();
        reqStub.params = {};
        serverStub.get.restore();
        productCompiler.getProduct.restore();
    });

    it('should have pattern of /pdp/:productId', async() => {
        await pdpHandler(serverStub);
        expect(serverStub.get).to.be.calledWith('/pdp/:productId');
    });

    it('should respond with response from productCompiler.getProduct', async () => {
        reqStub.params.productId ='123';
        await pdpHandler(serverStub);
        expect(productCompiler.getProduct).to.be.calledWith(reqStub.params.productId);
        expect(resStub.send).to.be.calledWith('bla');
    });

    it('should respond 404 for missing product', async () => {
        reqStub.params.productId ='124';
        productCompiler.getProduct.throws({status:404});
        await pdpHandler(serverStub);
        expect(resStub.status).to.be.calledWith(404);
        expect(resStub.send).to.be.calledWith('Not found');
    });

    it('should respond 500 any other error', async () => {
        reqStub.params.productId ='123';
        productCompiler.getProduct.throws({message: 'bang'});
        await pdpHandler(serverStub);
        expect(resStub.status).to.be.calledWith(500);
        expect(resStub.send).to.be.calledWith('Something has gone wrong');
    });
});