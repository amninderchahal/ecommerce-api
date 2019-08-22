import { Injectable, MiddlewareFunction, NestMiddleware, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { TokenHelper } from '../helpers/token-helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenHelper: TokenHelper) { }

  async resolve(routesWithoutAuth: RouteInfo[]): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      if (this.isExcluded(routesWithoutAuth, req)) {
        next();
      } else {
        await this.validateToken(req, res, next);
      }
    };
  }

  private async validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = this.extractTokenFromAuthHeader(authHeader)
    if (!token) {
      return res.status(401).send({ message: 'No auth token found' });
    }

    try {
      const verifiedUser = await this.tokenHelper.verify(token);
      req.currentUser = verifiedUser;
      next();
    }
    catch (err) {
      console.log('Token verification error:', (err.message ? err.message : err));
      return res.status(401).send({ message: 'Token Expired. Please login again.' });
    }
  }

  private isExcluded(routesWithoutAuth: RouteInfo[], req): boolean {
    return routesWithoutAuth.some(
      excludedRoute => {
        const isUrlEquals = req.baseUrl.toLowerCase().indexOf(excludedRoute.path.toLowerCase()) > -1;
        return (
          isUrlEquals &&
          (excludedRoute.method === RequestMethod.ALL
            || '' + excludedRoute.method === '' + RequestMethod[req.method])
        );
      });
  }

  private extractTokenFromAuthHeader(authHeader: string): string {
    var token;
    try {
      const tokenArr = authHeader.split(' ');
      var tokenType = tokenArr[0].toLowerCase();
  
      if (tokenType.includes('bearer')) {
        token = tokenArr[1];
      }
    } catch (e) { }
  
    return token;
  }
}
