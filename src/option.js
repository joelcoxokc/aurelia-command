import program from './index';

let argv = process.AURELIA.argv;

export default class Option{

  constructor(command, options){
    this.name         = options[0];
    this._flags       = options[1];
    this.description  = options[2];
    this._parseFn     = options[3];
    this.flags = {};
    this.flags = {
        bool : undefined
      , long : undefined
      , short: undefined
    };
    if (this._flags.length > program.maxFlags) {
      program.maxFlags = this._flags.length;
    }
    return this;
  }

  get isBool(){
    return /^--no-/.test(this._flags);
  }

  get value() {
    return argv[this.name] || argv[this.flags.long] || argv[this.flags.short] || argv[this.flags._flags];
  }

  parse() {
    if (this.isBool) {
      this.flags.bool = this.name;
    }
    else {
      this.flags.long  = this._flags.match(/\-\-(\w+)/)[1];
      this.flags.short = this._flags.match(/^\-(\w+)/)[1];
    }

    if (this.flags.short && argv[this.flags.short]) {
      argv[this.name] = this.value;
    }

    this._parseFn = this._parseFn || function(c){return c;};

    return this;
  }
}
