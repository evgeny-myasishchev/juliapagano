var Promise = require("bluebird");

var PagesReadModel = function(db) {
	this.getPages = function() {
		return db.select().from('pages');
	};
	
	this.getBlocks = function(pageId) {
		//TODO: Not implemented
	};
};

module.exports = {
	PagesReadModel: PagesReadModel
};