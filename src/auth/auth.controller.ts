import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistDTO } from './dto/regist.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService:AuthService){}
    
    @ApiBearerAuth()
    @Post('/regist')
    @Roles('Boss')
    async regist(@Body() body: RegistDTO){
        return this.authService.regist(body)
    }

    @Post('/login')
    async login(@Body() body: LoginDTO){
        return this.authService.login(body)
    }
}
