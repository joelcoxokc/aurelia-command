import Command from './command';
import * as logger from './logger';
import {EventEmitter} from 'events';

class Program extends EventEmitter{

  constructor(config) {
    super();
    this.maxFlags = 0;
    this.commands = {};
    this.aliases  = {};
    this.logger   = logger;
  }

  init(config) {
    this.config = config;
    return this;
  }

  command(Construction, commandId) {

    var command = new Command(this, this.config);
    command.createContext(Construction, commandId);
    this.commands[commandId] = command;
    return command;
  }

  register(Construction) {
    if (Construction.register && typeof Construction.register === 'function') {
      Construction.register(this.command.bind(this, Construction));
    }
    this.aliases[Construction.alias] = Construction.commandId;
  }

  start(argv) {
    var commandId = argv._[0];

    if (this.commands[commandId]) {
      if (argv.help) {
        this.emit('--help', {commandId:commandId, argv:argv});
      } else {
        this.emit('start', {commandId:commandId, argv:argv});
      }
    }
    else if (argv.help) {
      this.emit('--help', {all:true, argv:argv});
    }
  }

  isCommand(commandId) {
    return !!this.commands[commandId] || this.aliases[commandId];
  }
}

var _instance = _instance || new Program();

export default _instance;


import Option      from './option';
import command     from './decorate';
import option      from './decorate';
import alias       from './decorate';
import arg         from './decorate';
import description from './decorate';
import instance    from './decorate';


export * from './command';
export * from './option';
export * from './decorate';
