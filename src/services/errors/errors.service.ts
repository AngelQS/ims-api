// Local
import IErrorCourier from "./interfaces/IErrors.service";

export default class ErrorCourier {
  private error: IErrorCourier;

  constructor(error: IErrorCourier) {
    this.error = {
      requestId: error.requestId,
      session: error.session,
      type: error.type,
      severity: error.severity,
      message: error.message,
      petition: {
        host: error.petition.host,
        originalUrl: error.petition.originalUrl,
        method: error.petition.method,
        secure: error.petition.secure,
        status: {
          code: error.petition.status.code,
          message: error.petition.status.message,
        },
        headers: {
          contentType: error.petition.headers.contentType,
          userAgent: error.petition.headers.userAgent,
        },
      },
      iat: error.iat,
      nestedErrors: error.nestedErrors,
      context: error.context,
      stack: error.stack,
    };
  }

  public getError() {
    return this.error;
  }
}
