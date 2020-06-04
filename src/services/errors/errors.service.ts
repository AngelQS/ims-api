// Local
import IErrorCourier from "./interfaces/IErrors.service";

export default class ErrorCourier extends Error {
  private errorBody: IErrorCourier;

  constructor(message: string, errorBody: IErrorCourier) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.errorBody = {
      request: {
        id: errorBody.request.id,
        iat: errorBody.request.iat,
      },
      session: errorBody.session,
      type: errorBody.type,
      severity: errorBody.severity,
      message: errorBody.message,
      status: {
        code: errorBody.status.code,
        message: errorBody.status.message,
      },
      method: errorBody.method,
      complete: errorBody.complete,
      host: errorBody.host,
      originalUrl: errorBody.originalUrl,
      secure: errorBody.secure,
      context: {
        name: errorBody.context.name,
        path: errorBody.context.path,
      },
      headers: {
        contentType: errorBody.headers.contentType,
        userAgent: errorBody.headers.userAgent,
      },
      errorIat: errorBody.errorIat,
      nestedErrors: errorBody.nestedErrors,
      stack: this.stack,
    };
  }

  public getError() {
    return this.errorBody;
  }
}

/* {
  requestId: "baeb7177-b908-4b7c-ab0d-bd1884ea9bb6",
  session: "user session that contains user",
  type: "Client Error",
  severity: "Error",
  message: "Signup Failure",
  status: {
    code: "500",
    message: "Invalid request",
  },
  method: "POST",
  complete: true,
  host: "localhost",
  originalUrl: "/account/login",
  secure: true,
  context: {
    name: "BcryptService.hashPassword",
    path: "./src/services/hashing/bcrypt.service.ts"
  },
  headers: {
    contentType: "application/x-www-form-urlencoded",
    userAgent: "PostmanRuntime/7.24.1",
  },
  request-iat: "20:49",
  error-iat: "20:56",
  nestedErrors: {name: "Validation", ...}
  stack: "at /home/angelqs/Documentos/workspace/node/instagram-MERN-stack/src/middlewares/auth.middlewares.ts:57:18",
} */
