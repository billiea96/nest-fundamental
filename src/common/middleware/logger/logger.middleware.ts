import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    console.log(
      `${req.method} ${req.url} Request.....`,
      new Date().toLocaleString(),
    );
    next();
  }
}
