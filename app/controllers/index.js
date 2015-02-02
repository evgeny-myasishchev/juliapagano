// exports.home = {
// 	index: function(req, res) {
// 		res.render('home/index');
// 	}
// }

exports.pages_controller = {
	createPageAction: function(page) {
		return function(req, res) {
			res.render('page', {
				currentPage: page
			});
		}
	}
}