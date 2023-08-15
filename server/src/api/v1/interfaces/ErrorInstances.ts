export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
export class Validation extends Error {
  constructor(public status: number, message: string, public field: string) {
    super(message);
  }
}
export class NotFound extends Error {
  constructor(public status: number) {
    super("Not found");
  }
}
export class Unauthorized extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
export class MongoDBError extends Error {
  public error: string = "";
  constructor(public status: number, public erros: string[]) {
    super("MongoDB validation error");
    this.error = erros.join(", ");
  }
}
