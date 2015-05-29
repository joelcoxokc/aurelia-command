'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var argv = process.AURELIA.argv;

var Option = (function () {
  function Option(command, options) {
    _classCallCheck(this, Option);

    this.name = options[0];
    this._flags = options[1];
    this.description = options[2];
    this._parseFn = options[3];
    this.flags = {};
    this.flags = {
      bool: undefined,
      long: undefined,
      short: undefined
    };
    if (this._flags.length > _index2['default'].maxFlags) {
      _index2['default'].maxFlags = this._flags.length;
    }
    return this;
  }

  _createClass(Option, [{
    key: 'isBool',
    get: function () {
      return /^--no-/.test(this._flags);
    }
  }, {
    key: 'value',
    get: function () {
      return argv[this.name] || argv[this.flags.long] || argv[this.flags.short] || argv[this.flags._flags];
    }
  }, {
    key: 'parse',
    value: function parse() {
      if (this.isBool) {
        this.flags.bool = this.name;
      } else {
        this.flags.long = this._flags.match(/\-\-(\w+)/)[1];
        this.flags.short = this._flags.match(/^\-(\w+)/)[1];
      }

      if (this.flags.short && argv[this.flags.short]) {
        argv[this.name] = this.value;
      }

      this._parseFn = this._parseFn || function (c) {
        return c;
      };

      return this;
    }
  }]);

  return Option;
})();

exports['default'] = Option;
module.exports = exports['default'];