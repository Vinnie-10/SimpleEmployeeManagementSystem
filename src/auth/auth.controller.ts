import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistDTO } from './dto/regist.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../decorator/roles.decorator';
import { JWTAuthGuard } from '../guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService:AuthService){}
    
    @ApiBearerAuth()
    @Post('/regist')
    @UseGuards(JWTAuthGuard)
    @Roles('Boss')
    async regist(@Body() body: RegistDTO){
        return this.authService.regist(body)
    }

    @Post('/login')
    async login(@Body() body: LoginDTO){
        return this.authService.login(body)
    }
}
