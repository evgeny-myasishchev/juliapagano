const { expect } = require('chai');
const _ = require('lodash');
const sinon = require('sinon');

const HttpError = require('../app/lib/HttpError');
const chance = require('./mocks/chance');
const errorHandlingMiddleware = require('../app/lib/errorHandlingMiddleware');

describe('errorHandlingMiddleware', () => {
  function createReq(opts = {}) {
    const { accepts } = opts;
    return {
      accepts: contentType => _.get(accepts, contentType, true),
    };
  }

  function createRes() {
    let jsonVal;
    let statusVal;
    const headers = {};
    let sentData;
    return {
      get jsonVal() { return jsonVal; },
      json(val) { jsonVal = val; },

      get statusVal() { return statusVal; },
      status(val) { statusVal = val; },

      get headers() { return headers; },
      set(val) { _.merge(headers, val); },

      get sentData() { return sentData; },
      send(data) { sentData = data; },
    };
  }

  function setupSubjects(opts = {}) {
    const { mw, req } = opts;
    return {
      mw: errorHandlingMiddleware(mw),
      req: createReq(req),
      res: createRes(),
      next: sinon.spy(),
    };
  }

  function createHttpError() {
    return new HttpError(
      chance.integer({ min: 100, max: 599 }),
      `Status${chance.word()}`,
      `Details${chance.word()}`
    );
  }

  describe('json', () => {
    it('should send json if client accepts it', () => {
      const err = createHttpError();
      const subj = setupSubjects();
      subj.mw(err, subj.req, subj.res, subj.next);
      expect(subj.next).to.have.callCount(0);
      expect(subj.res.jsonVal).to.eql({
        error: {
          statusCode: err.statusCode,
          statusMessage: err.statusMessage,
          details: err.details,
        },
      });
    });

    it('should include stack if configured', () => {
      const err = createHttpError();
      err.stack = `fake-stack-${chance.word()}`;
      const subj = setupSubjects({ mw: { showStack: true } });
      subj.mw(err, subj.req, subj.res, subj.next);
      expect(subj.res.jsonVal).to.eql({
        error: {
          statusCode: err.statusCode,
          statusMessage: err.statusMessage,
          details: err.details,
          stack: err.stack,
        },
      });
    });

    it('should handle regular errors as 500', () => {
      const err = new Error(`Some error: ${chance.sentence()}`);
      const subj = setupSubjects();
      subj.mw(err, subj.req, subj.res, subj.next);
      expect(subj.res.statusVal).to.eql(500);
      expect(subj.res.jsonVal).to.eql({
        error: {
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          details: err.message,
        },
      });
    });

    it('should set additional responseHeaders provided with error', () => {
      const err = createHttpError();
      err.responseHeaders = {
        Header1: `Header1-${chance.word()}`,
        Header2: `Header2-${chance.word()}`,
      };
      const subj = setupSubjects();
      subj.mw(err, subj.req, subj.res, subj.next);
      expect(subj.res.headers).to.eql(err.responseHeaders);
    });
  });

  describe('text', () => {
    it('should send plain text if anything other than json is accepted', () => {
      const err = createHttpError();
      const subj = setupSubjects({
        req: { accepts: { json: false, text: true } },
      });
      subj.mw(err, subj.req, subj.res, subj.next);
      expect(subj.next).to.have.callCount(0);
      expect(subj.res.sentData).to.eql(err.toString());
    });

    it('should include stack if configured', () => {
      const err = createHttpError();
      const subj = setupSubjects({
        mw: { showStack: true },
        req: { accepts: { json: false, text: true } },
      });
      subj.mw(err, subj.req, subj.res, subj.next);
      expect(subj.res.sentData).to.eql(err.stack);
    });

    it('should handle regular errors as 500', () => {
      const err = createHttpError();
      const subj = setupSubjects({
        req: { accepts: { json: false, text: true } },
      });
      subj.mw(err, subj.req, subj.res, subj.next);
      expect(subj.res.sentData).to.eql(HttpError.fromError(err).toString());
    });
  });
});
