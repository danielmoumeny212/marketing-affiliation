import { Body, Controller, Post, BadRequestException, NotFoundException, Res,  UseInterceptors, ClassSerializerInterceptor, UseGuards} from "@nestjs/common";
import  * as bcrypt from "bcryptjs";
import { Response } from "express";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController { 
 
  constructor(private userService: UserService, private authService: AuthService){}
   
   
   @Post("admin/register")
   async register(@Body() body: RegisterDto){
    const { password_confirm} = body; 
    if(body.password !== password_confirm){
       throw new BadRequestException("Passwords do not match"); 
    }
    return this.authService.newUser(body)
    
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
    const jwt = await this.authService.generateJwt({
       id: user.id, 
       last_name: user.last_name
    })
     response.cookie('jwt',  jwt, {httpOnly: true});

    return { message: "success"}; 
   }
   
  
   
   @UseGuards(AuthGuard)
   @Post("admin/logout")
   async logout(@Res({passthrough: true}) response: Response){
    response.clearCookie('jwt');
    return {
       message: "success",
    }
   }

   
}