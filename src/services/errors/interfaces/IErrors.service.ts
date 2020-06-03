export default interface IErrorCourier {
  requestId: string;
  session: object | undefined;
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
    contentType: string | undefined;
    userAgent: string | undefined;
  };
  requestIat: string | string[] | undefined;
  errorIat: string;
  nestedErrors: any;
  stack: string | undefined;
}
