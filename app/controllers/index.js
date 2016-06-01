'use strict';

exports.adminController = {
  index: function (req, res) {
    res.render('admin/index');
  },
};

exports.pagesController = {
  createPageAction: function (page) {
    return function (req, res) {
      res.render(page.template, { currentPage: page });
    };
  },
};
