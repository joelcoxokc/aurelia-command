'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _logger = require('./logger');

var logger = _interopRequireWildcard(_logger);

var _events = require('events');

var _option = require('./option');

var _option2 = _interopRequireDefault(_option);

var _decorate = require('./decorate');

var _decorate2 = _interopRequireDefault(_decorate);

var _decorate3 = _interopRequireDefault(_decorate);

var _decorate4 = _interopRequireDefault(_decorate);

var _decorate5 = _interopRequireDefault(_decorate);

var _decorate6 = _interopRequireDefault(_decorate);

var _decorate7 = _interopRequireDefault(_decorate);

var Program = (function (_EventEmitter) {
  function Program(config) {
    _classCallCheck(this, Program);

    _get(Object.getPrototypeOf(Program.prototype), 'constructor', this).call(this);
    this.maxFlags = 0;
    this.commands = {};
    this.aliases = {};
    this.logger = logger;
  }

  _inherits(Program, _EventEmitter);

  _createClass(Program, [{
    key: 'init',
    value: function init(config) {
      this.config = config;
      return this;
    }
  }, {
    key: 'command',
    value: function command(Construction, commandId) {

      var command = new _command2['default'](this, this.config);
      command.createContext(Construction, commandId);
      this.commands[commandId] = command;
      return command;
    }
  }, {
    key: 'register',
    value: function register(Construction) {
      for (var _len = arguments.length, inject = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        inject[_key - 1] = arguments[_key];
      }

      if (Construction.register && typeof Construction.register === 'function') {
        Construction.register(this.command.bind(this, Construction));
      }
      Construction._inject = inject;
      this.aliases[Construction.alias] = Construction.commandId;
    }
  }, {
    key: 'start',
    value: function start(argv) {
      var commandId = argv._[0];

      if (this.commands[commandId]) {
        if (argv.help) {
          this.emit('--help', { commandId: commandId, argv: argv });
        } else {
          this.emit('start', { commandId: commandId, argv: argv });
        }
      } else if (argv.help) {
        this.emit('--help', { all: true, argv: argv });
      }
    }
  }, {
    key: 'isCommand',
    value: function isCommand(commandId) {
      return !!this.commands[commandId] || this.aliases[commandId];
    }
  }]);

  return Program;
})(_events.EventEmitter);

var _instance = _instance || new Program();

exports['default'] = _instance;

_defaults(exports, _interopRequireWildcard(_command));

_defaults(exports, _interopRequireWildcard(_option));

_defaults(exports, _interopRequireWildcard(_decorate));