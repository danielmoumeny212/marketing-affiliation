import { Body, Controller, Post, Logger, BadRequestException, NotFoundException, Res } from "@nestjs/common";
import  * as bcrypt from "bcryptjs";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "src/user/user.service";

@Controller()
export class AuthController { 
  private readonly logger = new Logger(AuthController.name)
 
  constructor(private userService: UserService, private jwtService: JwtService){}
 
   @Post("admin/register")
   async register(@Body() body: RegisterDto){
    this.logger.log("Handling registration request of user with email: " + body.email + " ...")
    const { password_confirm , ...data} = body; 
    if(body.password !== password_confirm){
       throw new BadRequestException("Passwords do not match"); 
    }
    const hashedPwd = await bcrypt.hash(body.password, 12)
     return this.userService.save({
      ...data, 
      password: hashedPwd, 
      is_ambassador: false
     }); 
   }

   @Post("admin/login")
   async login(
    @Body() {email, password}: {email: string, password: string}, 
     @Res({passthrough: true}) response: Response 
   ){
 
    const user = await this.userService.findOne({email});
    if (!user){
        throw new NotFoundException("User not found");
    }
    if (!await bcrypt.compare(password, user.password)){
       throw new BadRequestException("Invalid credentials");

    }
    const jwt = await this.jwtService.signAsync({
       sub: user.id, 
       last_name: user.last_name
    })
     response.cookie('jwt',  jwt, {httpOnly: true});
     
    return { message: "success"}; 
   }
}