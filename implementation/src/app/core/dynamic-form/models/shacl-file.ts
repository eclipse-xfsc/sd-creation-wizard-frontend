import {Shape} from './shape';

export class ShaclFile {
  shapes: Shape[];
  prefixes: Prefix[];

  constructor(
    options: {
      shapes?: Shape[];
      prefixes?: Prefix[];
    } = {}
  ) {
    this.shapes = options.shapes || [];
    this.prefixes = options.prefixes || [];
  }
}

export class Prefix {

  alias: string;
  url: string;

  constructor(alias, url) {
    this.alias = alias;
    this.url = url;
  }
}
