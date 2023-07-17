class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
export default HttpError;

export const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof HttpError;
};
