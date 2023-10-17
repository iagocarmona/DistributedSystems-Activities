// package: mongomovies
// file: movies.proto

import * as jspb from "google-protobuf";

export class Genre extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Genre.AsObject;
  static toObject(includeInstance: boolean, msg: Genre): Genre.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Genre, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Genre;
  static deserializeBinaryFromReader(message: Genre, reader: jspb.BinaryReader): Genre;
}

export namespace Genre {
  export type AsObject = {
    name: string,
  }
}

export class Cast extends jspb.Message {
  getActor(): string;
  setActor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Cast.AsObject;
  static toObject(includeInstance: boolean, msg: Cast): Cast.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Cast, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Cast;
  static deserializeBinaryFromReader(message: Cast, reader: jspb.BinaryReader): Cast;
}

export namespace Cast {
  export type AsObject = {
    actor: string,
  }
}

export class Language extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Language.AsObject;
  static toObject(includeInstance: boolean, msg: Language): Language.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Language, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Language;
  static deserializeBinaryFromReader(message: Language, reader: jspb.BinaryReader): Language;
}

export namespace Language {
  export type AsObject = {
    name: string,
  }
}

export class Director extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Director.AsObject;
  static toObject(includeInstance: boolean, msg: Director): Director.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Director, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Director;
  static deserializeBinaryFromReader(message: Director, reader: jspb.BinaryReader): Director;
}

export namespace Director {
  export type AsObject = {
    name: string,
  }
}

export class Writer extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Writer.AsObject;
  static toObject(includeInstance: boolean, msg: Writer): Writer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Writer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Writer;
  static deserializeBinaryFromReader(message: Writer, reader: jspb.BinaryReader): Writer;
}

export namespace Writer {
  export type AsObject = {
    name: string,
  }
}

export class Country extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Country.AsObject;
  static toObject(includeInstance: boolean, msg: Country): Country.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Country, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Country;
  static deserializeBinaryFromReader(message: Country, reader: jspb.BinaryReader): Country;
}

export namespace Country {
  export type AsObject = {
    name: string,
  }
}

export class Movie extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getPlot(): string;
  setPlot(value: string): void;

  clearGenresList(): void;
  getGenresList(): Array<Genre>;
  setGenresList(value: Array<Genre>): void;
  addGenres(value?: Genre, index?: number): Genre;

  getRuntime(): number;
  setRuntime(value: number): void;

  getRated(): string;
  setRated(value: string): void;

  clearCastList(): void;
  getCastList(): Array<Cast>;
  setCastList(value: Array<Cast>): void;
  addCast(value?: Cast, index?: number): Cast;

  getNumMflixComments(): number;
  setNumMflixComments(value: number): void;

  getPoster(): string;
  setPoster(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getFullplot(): string;
  setFullplot(value: string): void;

  clearLanguagesList(): void;
  getLanguagesList(): Array<Language>;
  setLanguagesList(value: Array<Language>): void;
  addLanguages(value?: Language, index?: number): Language;

  getReleased(): string;
  setReleased(value: string): void;

  clearDirectorsList(): void;
  getDirectorsList(): Array<Director>;
  setDirectorsList(value: Array<Director>): void;
  addDirectors(value?: Director, index?: number): Director;

  clearWritersList(): void;
  getWritersList(): Array<Writer>;
  setWritersList(value: Array<Writer>): void;
  addWriters(value?: Writer, index?: number): Writer;

  getLastupdated(): string;
  setLastupdated(value: string): void;

  getYear(): string;
  setYear(value: string): void;

  clearCountriesList(): void;
  getCountriesList(): Array<Country>;
  setCountriesList(value: Array<Country>): void;
  addCountries(value?: Country, index?: number): Country;

  getType(): string;
  setType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Movie.AsObject;
  static toObject(includeInstance: boolean, msg: Movie): Movie.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Movie, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Movie;
  static deserializeBinaryFromReader(message: Movie, reader: jspb.BinaryReader): Movie;
}

export namespace Movie {
  export type AsObject = {
    id: string,
    plot: string,
    genresList: Array<Genre.AsObject>,
    runtime: number,
    rated: string,
    castList: Array<Cast.AsObject>,
    numMflixComments: number,
    poster: string,
    title: string,
    fullplot: string,
    languagesList: Array<Language.AsObject>,
    released: string,
    directorsList: Array<Director.AsObject>,
    writersList: Array<Writer.AsObject>,
    lastupdated: string,
    year: string,
    countriesList: Array<Country.AsObject>,
    type: string,
  }
}

export class Request extends jspb.Message {
  hasMovie(): boolean;
  clearMovie(): void;
  getMovie(): Movie | undefined;
  setMovie(value?: Movie): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Request.AsObject;
  static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Request;
  static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
}

export namespace Request {
  export type AsObject = {
    movie?: Movie.AsObject,
    data: string,
  }
}

export class Response extends jspb.Message {
  getSucess(): boolean;
  setSucess(value: boolean): void;

  getMessage(): string;
  setMessage(value: string): void;

  clearMoviesList(): void;
  getMoviesList(): Array<Movie>;
  setMoviesList(value: Array<Movie>): void;
  addMovies(value?: Movie, index?: number): Movie;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    sucess: boolean,
    message: string,
    moviesList: Array<Movie.AsObject>,
  }
}

