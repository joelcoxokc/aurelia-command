import repeat from 'lodash/string/repeat';
import Option from './option';
import Promise from 'bluebird';

let argv, env, program;
export default class Command{

  /*
      constructor
      @param parent    program
      @param config    globalConfig

      @Event start     Check if is current command
                       Call parseOptions to parse options
                       run _runAction()

      @Event --help    Check if is current command or if all commands
                       Call parseOptions to parse options
                       run context.help()

   */
  constructor(parent, config) {
    var self = this;
    program = parent;
    argv    = process.AURELIA.argv || config.argv;
    this.program  = program;
    this._readyCallbacks = [];

    program.on('start', function(payload) {
      if (payload.commandId === self.context.commandId || payload.commandId === self.context.alias) {
        self._runAction();
      }
    });

    program.on('--help', function(payload){
      if (payload.all || payload.commandId === self.context.commandId || payload.commandId === self.context.alias) {
        self._runHelp(payload.all);
      }
    });

    return this;
  }

  /*
      Create context
      @param ClassConstruction {Class Constructor} The CustomCommand Constructor.
      @param commandId    {String}      The name of the command;
   */
  createContext (ClassConstruction, commandId){

    ClassConstruction.commandId = ClassConstruction.commandId || commandId;
    ClassConstruction.argv      = ClassConstruction.argv      || argv;
    ClassConstruction._flags    = ClassConstruction._flags    || [];
    ClassConstruction._args     = ClassConstruction._args     || argv._.slice(1) || [];
    ClassConstruction.options   = ClassConstruction.options   || {};
    ClassConstruction._inject   = ClassConstruction._inject   || [];

    this.context = ClassConstruction;
    return this.context;
  }

  // Handles events bound to the specific command
  _onEvent(proto, evt){
    program.on(evt, function(payload){
      this.context[proto].bind(this.context)(payload);
    }.bind(this));
  }

  /*
      Set options on the ClassConstruction.__flags for later parsing
   */
  option(...args){
    var self = this;
    this.context._flags.push(new Option(this.context, args));
    return this;
  }

  /*
      Set args on the ClassConstruction.__args for later parsing
   */
  args(...args) {
    this.context.__args = this.context.__args || args;
    return this;
  }

  /*
      Set the alias on the ClassConstruction.alias
   */
  alias(str) {
    this.context._alias = str;
    if ((argv._[0] === this.context.alias) && argv._[0] !== this.context.commandId) {
      argv._[0] = this.context.commandId;
    }
    return this;
  }

  /*
      Set the description on the ClassConstruction._description
   */
  description(text) {
    this.context._description = text;
    return this;
  }

  /*
      Parse the context
      Run   instance.canExecute()
      then  instance.beforAction()
      then  instance.action()
      then  instance.afterAction()
      catch instance.onError()
   */
  _runAction(){
    let self     = this;
    let instance = this.parse();

    return Promise.resolve()
      .then(function(){
        return instance.canExecute.call(instance, instance.args, instance.options);
      })
      .then(function(canExecute) {
        if (canExecute)
          return instance.beforeAction.call(instance, instance.args, instance.options);
      })
      .then(function(before) {
        return instance.action.call(instance, instance.args, instance.options, before);
      })
      .then(function(result) {
        return instance.afterAction.call(instance, instance.args, instance.options, result);
      })
      .catch(function(result){
        return instance.onError.call(instance, instance.args, instance.options, result);
      });
  }

  /*
      Run help
      @param {Boolean} isAll run a separate log if the all --help is executed
   */
  _runHelp(isAll) {
    var self = this;
    let instance = this.parse();
    return Promise.resolve()
      .then(function(){
        return isAll
          ? self._allHelp.call(instance, console.log, instance.argv, instance.options)
          : instance.help.call(instance, console.log, instance.argv, instance.options);
      });
  }

  parse(){
    let injectable = [];
    for (let inst in this.context._inject) {
      if (typeof this.context._inject[inst] === 'function') {
        injectable.push(new this.context._inject[inst]());
      } else {
        injectable.push(this.context._inject[inst]);
      }
    }
    let ConstructedCommand = this.context.bind.apply( this.context ,
        [
            this.context.prototype

        ].concat(injectable) );

    // Create The instance
    //////////////////////
    let command = new ConstructedCommand();
    //////////////////////////////////////

    // Apply Static properties to Commands Prototype.

    command.description = this.context._description;
    command.commandId = this.context.commandId;
    command.options   = {};
    command.flags     = {};
    command.argv      = this.context.argv;
    command.args      = {_:[]};

    command.argv._.shift();


    // Apply args

    let argvArgs = this.context._args;

    for (let index in this.context.__args) {
      let argStr     = this.context.__args[index];
      let argName    = argStr.match(/(\w+)/)[0];
      let isRequired = /</.test(argStr);
      let isOptional = /\[/.test(argStr);
      let argValue   = argvArgs.shift();

      if (argValue) {
        command.args[argName] = argValue;
        command.args._.push(argValue);
      }

      if (isRequired && !argValue) {
        return Promise.reject({msg: ' '+argName+' Argument ['+index+'] is Required!', type:'err'});
      }
      command._argString = command._argString || '';
      command._argString += ' ' + argStr;
    }

    // parse FLAGS
    for(let index in this.context._flags) {
      let flag = this.context._flags[index].parse();
      command.flags[flag.name]   = flag;
      command.options[flag.name] = flag.value;
    }

    let DynamicPrototypes = {
        canExecute  : function( ){return true;}
      , beforeAction: function(c){return c;}
      , action      : function(c){return c;}
      , afterAction : function(c){return c;}
      , onError     : this._onError
      , help        : this._help
    };

    for (let PrototypeName in DynamicPrototypes) {
      if (!command[PrototypeName] || typeof command[PrototypeName] !== 'function') {
        command[PrototypeName] = DynamicPrototypes[PrototypeName];
      }
    }

    return command;
  }

  _help(log, argv, options) {
    var isFlags;
    log();
    log('    Usage: %s %s', this.commandId.green, (this._argString || '').cyan);
    log();
    log('    Info:  '+(this.description || '').green);
    log();

    for (let index in this.flags) {
      if (!isFlags) {
        log('    flags:');
        log();
      }
      isFlags = true;
      let option = this.flags[index];
      let padding = repeat(' ', program.maxFlags - option._flags.length);

      log('        '+option._flags.cyan + padding, option.required ? ('(','required'.red+')') : ('('+'optional'.green+')'), option.description);
    }
    log();
  }

  _allHelp(log, argv, options) {
    log();
    log('%s %s %s', this.commandId.green, (this._argString || ''), (this.description || ''));
    for (let index in this.flags) {
      let option = this.flags[index];
      let padding = repeat(' ', program.maxFlags - option._flags.length);

      log(this.commandId.green +' '+option._flags.cyan + padding, option.required ? ('(','required'.red+')') : ('('+'optional'.green+')'), option.description);
    }
    log();
  }

  _onError(args, options, issue) {
    if (issue.msg) {
      console.error(issue.msg);
      console.error(issue.error || issue.Error);
    } else {
      console.error(issue);
      throw issue;
    }
  }


  addPrototype(name, value, force){
    if (force)
      this.context[name] = value;
    else
      this.context[name] = this.context[name] || value;
  }

  isPrototype(name, type) {
    return name && typeof name === 'string' && typeof this.context[name] === (type || 'function');
  }
}

