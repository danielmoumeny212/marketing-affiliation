import { Inject, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";


export class UserInRequestMiddleware implements NestMiddleware{
   
   @Inject(AuthService) private authService: AuthService;
   @Inject(UserService) private userService: UserService;
   async use(req: Request, res: Response, next: NextFunction){
     const cookie = req.cookies['jwt']
     const {id}  = await this.authService.checkCookie(cookie); 
     if(id === undefined)  next(); 
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const { password , ...user} =await this.userService.findOne({id})
     req['user'] = user; 
     next(); 
  }
}