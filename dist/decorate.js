'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.command = command;
exports.option = option;
exports.alias = alias;
exports.arg = arg;
exports.description = description;
exports.instance = instance;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _option = require('./option');

var _option2 = _interopRequireDefault(_option);

function command(name) {
  return function (ClassConstruction) {
    ClassConstruction.commandId = name;
    _2['default'].command(ClassConstruction, name);
    return ClassConstruction;
  };
}

function option() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (ClassConstruction) {
    ClassConstruction._flags = ClassConstruction._flags || {};
    ClassConstruction._flags[args[0]] = new _option2['default'](ClassConstruction, args);
    return ClassConstruction;
  };
}

function alias(str) {
  return function (ClassConstruction) {
    ClassConstruction._alias = str;
    _2['default'].aliases[str] = ClassConstruction;
    return ClassConstruction;
  };
}

function arg(str) {
  return function (ClassConstruction) {
    ClassConstruction._args = ClassConstruction._args || [];
    ClassConstruction._args.push(str);
    return ClassConstruction;
  };
}

function description(str) {
  return function (ClassConstruction) {
    ClassConstruction._description = str;
    return ClassConstruction;
  };
}

function instance() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return function (ClassConstruction) {
    ClassConstruction._inject = args;
    return ClassConstruction;
  };
}