// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as Tokens from 'csrf';
import { CookieOptions, NextFunction, Request, Response } from 'express';

const tokens = new Tokens({
  secretLength: 16,
  saltLength: 16,
});

const defaultCsrfCookie: CookieOptions = {
  signed: true,
  sameSite: true,
  httpOnly: true,
  secure: true,
};

const secretKey = 'csrfSecret';

export const getCsrfFromRequest = (req: Request) => {
  return (
    (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    req.headers['csrf-token'] ||
    req.headers['xsrf-token'] ||
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token'] ||
    req.cookies['csrf-token'] ||
    req.cookies['xsrf-token'] ||
    req.cookies['x-csrf-token'] ||
    req.cookies['x-xsrf-token']
  );
};

export const getSecretFromRequest = (req: Request) => {
  return req.signedCookies[secretKey];
};

export const setSecret = (req: Request, res: Response, secret: string) => {
  res.cookie(secretKey, secret, defaultCsrfCookie);
};

export function verifyCsrf(secret: string, token: string) {
  return tokens.verify(secret, token);
}

export const csrf = () => {
  return function (req: Request, res: Response, next: NextFunction) {
    const isSignIn = req.path === '/auth/sign-in';

    let secret = getSecretFromRequest(req);

    /**
     * If system does not have secret in header or user sign,
     * system will create a csrf secret
     */
    if (!secret || isSignIn) {
      secret = tokens.secretSync();
      setSecret(req, res, secret);
    }

    req.getCsrfToken = () => {
      const token = tokens.create(secret);
      return token;
    };
    next();
  };
};
