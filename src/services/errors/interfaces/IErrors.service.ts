export default interface IErrorCourier {
  requestId: string;
  session: object | null;
  type: string;
  severity: "error" | "warning" | "alarm";
  message: string;
  context: string;
  iat: string | Date;
  petition: {
    host: string;
    originalUrl: string;
    method: string;
    secure: boolean;
    status: {
      code: string | number;
      message: string;
    };
    headers: {
      contentType: string | null;
      userAgent: string | null;
    };
  };
  nestedErrors: any;
  stack: string | null;

  /* request: {
    id: string;
    iat: string;
  };
  session: object | null;
  type: string;
  severity: "Error" | "Warning" | "Alarm";
  message: string;
  status: {
    code: string | number;
    message: string;
  };
  method: string;
  complete: boolean;
  host: string;
  originalUrl: string;
  secure: boolean;
  context: {
    name: string;
    path: string;
  };
  headers: {
    contentType: string | null;
    userAgent: string | null;
  };
  errorIat: string;
  nestedErrors: any;
  stack: string | null; */
}
