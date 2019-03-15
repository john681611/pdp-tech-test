const expectAssert = require('expect-assert');
const chai = require('chai');
chai.use(require('sinon-chai'));
global.expect = expectAssert(chai.expect);
global.sinon = require('sinon');