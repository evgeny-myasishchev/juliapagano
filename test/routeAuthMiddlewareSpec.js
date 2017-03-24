const { expect } = require('chai');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const HttpError = require('../app/lib/HttpError');
const chance = require('./mocks/chance');
const routeAuthMiddleware = require('../app/lib/routeAuthMiddleware');

describe('routeAuthMiddleware', () => {
  function createData(opts) {
    const data = {
      jwtTokenIss: `ISS-${chance.word()}`,
      jwtTokenAud: `AUD-${chance.word()}`,
      jwtTokenSecret: `TOKEN-SECRET-${chance.word()}`,
      requiredScopes: [
        `scope-1-${chance.word()}`,
        `scope-2-${chance.word()}`,
      ],
      next: sinon.spy(),
    };
    data.jwtPayload = {
      scope: `fake-scope-1-${chance.word()} ${data.requiredScopes.join(' ')} fake-scope-2-${chance.word()}`,
    };
    data.jwtToken = jwt.sign(data.jwtPayload, data.jwtTokenSecret, {
      audience: data.jwtTokenAud,
      issuer: data.jwtTokenIss,
    });
    data.reqHeaders = {
      Authorization: `Bearer ${data.jwtToken}`,
    };
    data.req = {
      get: header => _.get(data.reqHeaders, header, null),
    };
    data.res = {};
    if (_.isFunction(opts)) opts(data);
    else _.merge(data, opts);
    return data;
  }

  function createSubjects(data, opts) {
    const requiredScopes = _.get(opts, 'requiredScopes', data.requiredScopes);
    return {
      mw: routeAuthMiddleware.init(_.pick(data, ['jwtTokenSecret', 'jwtTokenIss', 'jwtTokenAud']))(requiredScopes),
      next: sinon.spy(),
    };
  }

  it('it should call next if token is valid and has required scopes', () => {
    const data = createData();
    const subj = createSubjects(data);
    subj.mw(data.req, data.res, subj.next);
    expect(subj.next).to.have.callCount(1);
  });

  it('should reject missing scope with HttpError', () => {
    const data = createData();
    const token = jwt.sign({ }, data.jwtTokenSecret, { audience: data.jwtTokenAud, issuer: data.jwtTokenIss });
    data.reqHeaders.Authorization = `Bearer ${token}`;
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        `HttpError { statusCode: 403, statusMessage: Forbidden, details: Invalid scopes. Required scopes: [${data.requiredScopes.join()}]`);
  });

  it('should fail to create if missing config', () => {
    expect(() => routeAuthMiddleware.init({})()).to.throw(Error, 'Config error: Please provide jwtTokenSecret');
  });

  it('should throw HttpError if missing scopes', () => {
    const data = createData();
    const subj = createSubjects(data, { requiredScopes: ['required-scope-1', 'required-scope-2'] });
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        'HttpError { statusCode: 403, statusMessage: Forbidden, details: Invalid scopes. Required scopes: [required-scope-1,required-scope-2]');
  });

  it('should throw HttpError if no Authorization token found', () => {
    const data = createData((d) => { _.set(d, 'reqHeaders', {}); });
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        'HttpError { statusCode: 401, statusMessage: Unauthorized, details: Auth header not found');
  });

  it('should throw HttpError if auth header has wrong structure', () => {
    const data = createData((d) => {
      _.set(d, 'reqHeaders', {
        Authorization: 'wrong-structure',
      });
    });
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        'HttpError { statusCode: 401, statusMessage: Unauthorized, details: Unexpected auth header structure');
  });

  it('should throw HttpError if auth header scheme is not Bearer', () => {
    const data = createData((d) => {
      _.set(d, 'reqHeaders', {
        Authorization: 'WrongScheme wrong-token',
      });
    });
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        'HttpError { statusCode: 401, statusMessage: Unauthorized, details: Unexpected auth schema: WrongScheme. Expected: Bearer');
  });

  it('should throw HttpError if token signature is invalid', () => {
    const token = jwt.sign({}, chance.string());
    const data = createData((d) => {
      _.set(d, 'reqHeaders', {
        Authorization: `Bearer ${token}`,
      });
    });
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        'HttpError { statusCode: 401, statusMessage: Unauthorized, details: invalid signature');
  });

  it('should throw HttpError if token issuer is invalid', () => {
    const data = createData();
    data.jwtTokenIss = `issuer-${chance.word()}`;
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        `HttpError { statusCode: 401, statusMessage: Unauthorized, details: jwt issuer invalid. expected: ${data.jwtTokenIss}`);
  });

  it('should throw HttpError if token audience is invalid', () => {
    const data = createData();
    data.jwtTokenAud = `aud-${chance.word()}`;
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        `HttpError { statusCode: 401, statusMessage: Unauthorized, details: jwt audience invalid. expected: ${data.jwtTokenAud}`);
  });

  it('should throw HttpError if token expired', () => {
    const data = createData();
    const token = jwt.sign({ scope: '' }, data.jwtTokenSecret, {
      audience: data.jwtTokenAud,
      issuer: data.jwtTokenIss,
      expiresIn: -10,
    });
    data.reqHeaders.Authorization = `Bearer ${token}`;
    const subj = createSubjects(data);
    expect(() => subj.mw(data.req, data.res, subj.next)).to.throw(HttpError,
        'HttpError { statusCode: 401, statusMessage: Unauthorized, details: jwt expired');
  });
});
