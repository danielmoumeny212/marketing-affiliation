import { Body, Controller, Post, Logger } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";

@Controller()
export class AuthController { 
  private readonly logger = new Logger(AuthController.name)
 
  

   @Post("admin/register")
   register(@Body() body: RegisterDto){
    this.logger.log("Handling registration request of user with email: " + body.email + " ...")
     return body; 
   }
}