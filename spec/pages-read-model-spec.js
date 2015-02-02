var db = require('./support/test-db');
var PagesReadModel = require('../app/models/pages-read-model').PagesReadModel;

describe('PagesReadModel', function() {
	var subject;
	var page1, page2, page3;
	beforeEach(function(done) {
		subject = new PagesReadModel(db);
		db.del().from('pages').then(function() {
			return db.insert([
				page1 = { title: 'page-1', path: '/page-1' },
				page2 = { title: 'page-2', path: '/page-2' },
				page3 = { title: 'page-3', path: '/page-3' }
			]).into('pages').catch(function(err) {
				console.log(err);
				done();
			}).finally(done);
		})
	});
	
	describe('getPages', function() {
		it('should return pages', function(done) {
			subject.getPages().then(function(pages) {
				expect(pages.length).toEqual(3);
				expect(pages[0]).toEqual(jasmine.objectContaining(page1));
				expect(pages[1]).toEqual(jasmine.objectContaining(page2));
				expect(pages[2]).toEqual(jasmine.objectContaining(page3));
				done();
			});
		});
	});
});