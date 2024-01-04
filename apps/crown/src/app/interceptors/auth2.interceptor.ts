import { HttpInterceptorFn } from '@angular/common/http';

export const auth2Interceptor: HttpInterceptorFn = (req, next) => {
  console.log('auth2Interceptor');

  return next(req);
};
