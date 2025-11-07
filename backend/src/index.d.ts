import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    authToken?: string; // your custom token property
    user?: any; // optional, if you want to attach decoded JWT
  }
}
