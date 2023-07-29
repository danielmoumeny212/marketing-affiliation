import { Body, Controller, Post, Logger, BadRequestException, NotFoundException, Res, Get, Req, UseInterceptors, ClassSerializerInterceptor, UseGuards , Put} from "@nestjs/common";
import  * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "src/user/user.service";
import { AuthGuard } from "./auth.guard";
import { UpdateUserDto } from "./dtos/update_user.dto";

@UseInterceptors(ClassSerializerInterceptor)
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
       id: user.id, 
       last_name: user.last_name
    })
     response.cookie('jwt',  jwt, {httpOnly: true});

    return { message: "success"}; 
   }
   
   @UseGuards(AuthGuard)
   @Get("admin/me")
   async user(
    @Req() request: Request
   ){  
      const cookie = request.cookies['jwt'];
      const {id} = await this.jwtService.verifyAsync(cookie);
      const user = await this.userService.findOne({id})

      return user;

   }
   
   @UseGuards(AuthGuard)
   @Post("admin/logout")
   async logout(@Res({passthrough: true}) response: Response){
    response.clearCookie('jwt');

    return {
       message: "success",
    }
   }

   @UseGuards(AuthGuard)
   @Put("admin/users/info")
   async updateInfo (@Req() request: Request,
      @Body() user: UpdateUserDto
   ){
      const cookie = request.cookies['jwt'];
      const {id} = await this.jwtService.verifyAsync(cookie);

     await this.userService.update(id, {
      ...user 
     })
     return this.userService.findOne({id})
   }
}