'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.command = command;
exports.option = option;
exports.alias = alias;
exports.args = args;
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
    ClassConstruction._flags = ClassConstruction._flags || [];
    ClassConstruction._flags.push(new _option2['default'](ClassConstruction, args));
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

function args() {
  for (var _len2 = arguments.length, argNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    argNames[_key2] = arguments[_key2];
  }

  return function (ClassConstruction) {
    ClassConstruction.__args = ClassConstruction.__args || argNames;
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
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return function (ClassConstruction) {
    ClassConstruction._inject = args;
    return ClassConstruction;
  };
}