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

    this._flags = options[0];
    this.description = options[0];
    this._parseFn = options[0];
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
    key: 'isLong',
    get: function () {
      return /--\w+/.test(this._flags);
    }
  }, {
    key: 'isShort',
    get: function () {
      return /^-\w+/.test(this._flags);
    }
  }, {
    key: 'parse',
    value: function parse() {
      if (this.isBool) {
        this.name = this._flags.match(/--no-(\w+)/)[1];
        this.flags.bool = this._flags;
      } else if (this.isLong) {
        var key = this._flags.match(/\-\-(\w+)/);
        this.flags.long = key[0];
        this.name = key[1];
      }
      if (this.isShort) {
        var key = this._flags.match(/^-(\w+)/);
        this.flags.short = key[0];
        if (!this.name) {
          this.name = key[1];
        } else {
          this.alias = key[1];
          if (argv[this.alias]) {
            argv[this.name] = argv[this.alias];
          }
        }
      }
      this.value = argv[this.name];

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