const reductionsService = require('./reductions');
const nock = require('nock');
const reductionsMock = require('./reductions.mock');
const basePrice = '20';
const price = parseFloat(basePrice);

describe('reductionsService', () => {

    describe('get', () => {
        const config = {
            apiHost:'bob.com',
            usr: 'usr',
            pass: 'pass'
        };

        afterEach(() => {
            nock.cleanAll();
        });

        it('should return json product details', async () => {
            nock(`https://${config.apiHost}`)
                .get('/reductions/08237408')
                .reply(200, reductionsMock);
            const result = await reductionsService.get('08237408', config);
            expect(result).to.deep.eql(reductionsMock);
        });

        it('should fail and return 404 status if bad product code passed', async () => {
            nock(`https://${config.apiHost}`)
                .get('/reductions/nahh')
                .reply(404, 'notFound');
            try {
                await reductionsService.get('nahh', config);
            } catch (error) {
                expect(error.response.status).to.eql(404);
            }
        });

        it('should fail and return 500 status if error an occurred on server side', async () => {
            nock(`https://${config.apiHost}`)
                .get('/reductions/bang')
                .reply(500, 'bang');
            try {
                await reductionsService.get('bang', config);
            } catch (error) {
                expect(error.response.status).to.eql(500);
                expect(error.response.data).to.eql('bang');
            }
        });
    });


    describe('calcReduction', () => {
        let clock, reduction;
        /* eslint-disable camelcase */
        const baseReduction = {
            valid_from: '2019-02-27T00:00:00+00:00',
            valid_to: '2040-02-27T00:00:00+00:00',
            condition_type: 'ONLINE',
            currency_code: 'GBP',
            discount: {
                discount_type: 'PERCENTAGE',
                discount_value: '10%'
            }
        };
        /* eslint-enable camelcase */


        beforeEach(() => {
            clock = sinon.useFakeTimers(new Date('2019-03-17T03:24:00'));
            reduction = JSON.parse(JSON.stringify(baseReduction));
        });

        afterEach(() => {
            clock.restore();
        });

        it('should ignore reductions that are not ONLINE', () => {
            // eslint-disable-next-line camelcase
            reduction.condition_type = 'STORE';
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price);
        });

        it('should ignore reductions that are not GBP', () => {
            // eslint-disable-next-line camelcase
            reduction.currency_code = 'FR';
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price);
        });

        it('should ignore reductions not if before reduction date', () => {
            // eslint-disable-next-line camelcase
            clock = sinon.useFakeTimers(new Date('2019-01-17T03:24:00'));
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price);
        });

        it('should ignore reductions not if after reduction date', () => {
            // eslint-disable-next-line camelcase
            clock = sinon.useFakeTimers(new Date('2049-12-17T03:24:00'));
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price);
        });

        it('should ignore qualified reductions', () => {
            /* eslint-disable camelcase */
            reduction.discount = {
                discount_type: 'QUALIFIED',
                discount_value: '0.2'
            };
            /* eslint-enable camelcase */
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price);
        });

        it('should reduce cost by 10% given a percentage reduction of 10%', () => {
            // eslint-disable-next-line no-magic-numbers
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price * .9);
        });

        it('should reduce cost by 3 given a ammount reduction of 3', () => {
            /* eslint-disable camelcase */
            reduction.discount = {
                discount_type: 'AMOUNT',
                discount_value: '3'
            };
            /* eslint-enable camelcase */
            // eslint-disable-next-line no-magic-numbers
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price - 3);
        });

        it('should reduce cost by .2 given a ammount reduction of 0.2', () => {
            /* eslint-disable camelcase */
            reduction.discount = {
                discount_type: 'AMOUNT',
                discount_value: '0.2'
            };
            /* eslint-enable camelcase */
            // eslint-disable-next-line no-magic-numbers
            expect(reductionsService.calcReduction(price, reduction)).to.eql(price - .2);
        });
    });

    describe('calc', () => {
        let clock;
        /* eslint-disable camelcase */
        const reductions = [{
            valid_from: '2019-02-27T00:00:00+00:00',
            valid_to: '2040-02-27T00:00:00+00:00',
            condition_type: 'ONLINE',
            currency_code: 'GBP',
            discount: {
                discount_type: 'PERCENTAGE',
                discount_value: '10%'
            }
        },
        {
            valid_from: '2019-02-27T00:00:00+00:00',
            valid_to: '2040-02-27T00:00:00+00:00',
            condition_type: 'ONLINE',
            currency_code: 'GBP',
            discount: {
                discount_type: 'AMOUNT',
                discount_value: '15'
            }
        }];
        /* eslint-enable camelcase */


        beforeEach(() => {
            clock = sinon.useFakeTimers(new Date('2019-03-17T03:24:00'));
        });

        afterEach(() => {
            clock.restore();
        });

        it('should find the minimum value of two reductions', () => {
            expect(reductionsService.calc(basePrice, reductions)).to.deep.eql({
                // eslint-disable-next-line no-magic-numbers
                current:price - 15,
                was: price,
                diff: 15
            });
        });

        it('should return base price if no reductions', () => {
            expect(reductionsService.calc(basePrice, [])).to.eql({current: price});
        });

        it('should return base price if valid reductions', () => {
            /* eslint-disable camelcase */
            reductions[0].condition_type = 'STORE';
            reductions[1].condition_type = 'STORE';
            /* eslint-enable camelcase */
            expect(reductionsService.calc(basePrice, [])).to.eql({current: price});
        });
    });

});