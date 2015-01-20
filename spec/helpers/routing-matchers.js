jasmine.Expectation.prototype.toRouteTo = function(controllers, controllerName, actionName, done) {
	var requestExpectation = this.actual;
	var controller = controllers[controllerName] = {};
	var action = controller[actionName] = jasmine.createSpy(controllerName + '.' + actionName).and.callFake(function(req, res) {
		res.send('ok');
	});
	requestExpectation.expect(200).expect('ok').end(function(err) {
		if(err) done(err);
		expect(action).toHaveBeenCalled();
		done();
	});
}