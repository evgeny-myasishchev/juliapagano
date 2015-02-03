exports.admin_controller = {
	index: function(req, res) {
		res.render('admin/index');
	}
}

exports.pages_controller = {
	createPageAction: function(page) {
		return function(req, res) {
			res.render(page.template, { currentPage: page });
		}
	}
}