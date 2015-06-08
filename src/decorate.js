import program from './';
import Option from './option';

export function command(name) {
  return function(ClassConstruction) {
    ClassConstruction.commandId = name;
    program.command(ClassConstruction, name);
    return ClassConstruction;
  };
}

export function option(...args) {
  return function(ClassConstruction) {
    ClassConstruction._flags = ClassConstruction._flags   || [];
    ClassConstruction._flags.push(new Option(ClassConstruction, args));
    return ClassConstruction;
  };
}

export function alias(str) {
  return function(ClassConstruction) {
    ClassConstruction._alias = str;
    program.aliases[str] = ClassConstruction;
    return ClassConstruction;
  };
}

export function args(...argNames) {
  return function(ClassConstruction) {
    ClassConstruction.__args = ClassConstruction.__args || argNames;
    return ClassConstruction;
  };
}

export function description(str) {
  return function(ClassConstruction) {
    ClassConstruction._description = str;
    return ClassConstruction;
  };
}

export function instance(...args) {
  return function(ClassConstruction) {
    ClassConstruction._inject = args;
    return ClassConstruction;
  };
}
