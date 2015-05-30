import program from './index';

let argv = process.AURELIA.argv;

export default class Option{

  constructor(command, options){
    this._flags       = options[0];
    this.description  = options[0];
    this._parseFn     = options[0];
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
  get isLong() {
    return /--\w+/.test(this._flags);
  }

  get isShort() {
    return /^-\w+/.test(this._flags);
  }

  parse() {
    if (this.isBool) {
      this.name = this._flags.match(/--no-(\w+)/)[1];
      this.flags.bool = this._flags;
    }
    else if (this.isLong) {
      let key = this._flags.match(/\-\-(\w+)/);
      this.flags.long  = key[0];
      this.name = key[1];
    }
    if (this.isShort) {
      let key = this._flags.match(/^-(\w+)/);
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

    this._parseFn = this._parseFn || function(c){return c;};

    return this;
  }
}
