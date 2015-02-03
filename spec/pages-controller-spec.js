var controllers = require('../app/controllers');

describe('pages_controller', function() {
	var subject = controllers.pages_controller;
	
	describe('createPageAction', function() {
		it('should return an action that will render page template', function() {
			var page = {title: 'Page1', template: 'page-1'};
			var action = subject.createPageAction(page);
			var res = {
				render: jasmine.createSpy('render')
			};
			action({}, res);
			expect(res.render).toHaveBeenCalledWith('page-1', {currentPage: page});
		});
	});
});