const pricesService = require('../prices/prices');
const pricesServiceMock = require('../prices/prices.mock');
const productDetailsService = require('../productDetails/productDetails');
const productDetailsServiceMock = require('../productDetails/productDetails.mock');
const reductionsService = require('../reductions/reductions');
const reductionsServiceMock = require('../reductions/reductions.mock');
const productCompiler = require('./productCompiler');
const productCompilerMock = require('./productCompiler.mock');
const configFile = require('../../config/env');

const config = {
    apiHost:'bob.com',
    usr: 'usr',
    pass: 'pass'
};

const response404 = {
    response: {
        status: 404
    }
};

const response500 = {
    response: {
        status: 500,
        data: 'You where only supposed to blow the bloody doors off'
    }
};

describe('productCompiler', () => {

    beforeEach(() => {
        sinon.stub(configFile, 'get').returns(config);
        sinon.stub(productDetailsService, 'get').returns(JSON.parse(JSON.stringify(productDetailsServiceMock)));
        sinon.stub(pricesService, 'get').returns(pricesServiceMock);
        sinon.stub(reductionsService, 'get').returns(reductionsServiceMock);
        sinon.stub(reductionsService, 'calc').returns(pricesServiceMock.amount);
    });

    afterEach(() => {
        configFile.get.restore();
        productDetailsService.get.restore();
        pricesService.get.restore();
        reductionsService.get.restore();
        reductionsService.calc.restore();
    });

    it('should call productDetailsService then other services using response', async () => {
        await productCompiler.getProduct('p1234');
        expect(productDetailsService.get).to.have.been.calledWith('p1234');

        expect(pricesService.get).to.have.been.calledWith('08237408');
        expect(reductionsService.get).to.have.been.calledWith('08237408');

        expect(pricesService.get).to.have.been.calledWith('08237409');
        expect(reductionsService.get).to.have.been.calledWith('08237409');
        expect(reductionsService.calc).to.have.been.calledWith(pricesServiceMock.amount, reductionsServiceMock);
    });

    it('should get complete priceLists back after reductions', async () => {
        const results = await productCompiler.getProduct('p1234');
        expect(results).to.deep.eql(productCompilerMock);
    });

    describe('404 faults', () => {
        it('should fail with 404 if productDetailsService returns 404', async () => {
            productDetailsService.get.throws(response404);
            try {
                await productCompiler.getProduct('missing');
            } catch (error) {
                expect(error.status).to.eql(404);
            }
        });

        it('should fail with 404 if pricesService returns 404', async () => {
            pricesService.get.throws(response404);
            try {
                await productCompiler.getProduct('missing');
            } catch (error) {
                expect(error.status).to.eql(404);
            }
        });

        it('should fail with 404 if re reductionsService 404', async () => {
            reductionsService.get.throws(response404);
            try {
                await productCompiler.getProduct('missing');
            } catch (error) {
                expect(error.status).to.eql(404);
            }
        });
    });

    describe('500 faults', () => {
        it('should fail with 500 if productDetailsService returns 500', async () => {
            productDetailsService.get.throws(response500);
            try {
                await productCompiler.getProduct('missing');
            } catch (error) {
                expect(error).to.deep.eql(response500);
            }
        });

        it('should fail with 500 if pricesService returns 500', async () => {
            pricesService.get.throws(response500);
            try {
                await productCompiler.getProduct('missing');
            } catch (error) {
                expect(error).to.deep.eql(response500);
            }
        });

        it('should fail with 500 if reductionsService 500', async () => {
            reductionsService.get.throws(response500);
            try {
                await productCompiler.getProduct('missing');
            } catch (error) {
                expect(error).to.deep.eql(response500);
            }
        });
    });
});