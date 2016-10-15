'use strict';

const config = require('config');
const ET = require('email-templates').EmailTemplate;
const path = require('path');
const Promise = require('bluebird');

const templatesDir = config.get('EmailTemplate.baseDir');

class EmailTemplate {
  constructor(path, data) {
    this._path = path;
    this._data = data;
  }

  //Returns object like this { text, html }
  render() {
    const template = new ET(path.join(templatesDir, this._path));
    return new Promise((resolve, reject) => {
      template.render(this._data, function (err, res) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }
}

module.exports = EmailTemplate;
