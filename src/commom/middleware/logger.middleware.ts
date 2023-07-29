import { NestMiddleware, Injectable, Logger } from "@nestjs/common";
import { Response, Request , NextFunction} from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
  private logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction){
     this.logger.log(`handling ${req.method} request  to endpoint ${req.url !==""? req.url: "/"} ...`);
     next();
  }
}

