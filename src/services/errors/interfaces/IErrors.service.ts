export default interface IErrorCourier {
  request: {
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
  stack: string | null;
}
