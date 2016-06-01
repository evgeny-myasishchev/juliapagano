'use strict';

jasmine.Expectation.prototype.toRouteTo = function (controllers, controllerName, actionName, done) {
  expect(true).toBeTruthy();
  var requestExpectation = this.actual;
  var controller = controllers[controllerName] = controllers[controllerName] || {};
  var action = controller[actionName] = jasmine.createSpy(controllerName + '.' + actionName)
      .and.callFake(function (req, res) {
        res.send('ok');
      });

  requestExpectation.expect(200).expect('ok').end(function (err) {
    if (err) fail(err);
    expect(action).toHaveBeenCalled();
    done();
  });
};
