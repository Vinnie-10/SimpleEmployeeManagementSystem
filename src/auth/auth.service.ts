import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import pool from '../database/db';
import { RegistDTO } from './dto/regist.dto'
import { LoginDTO } from './dto/login.dto';
import jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    async regist(registerDto: RegistDTO){
        const {name, email, password, role} = registerDto;
        const [exist] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]) as any[];
        if (exist.length > 0){
            throw new ConflictException('Email is already registered')
        }

        const hashed = await bcrypt.hash(password, 10);
        const insert = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashed, role]
        );
        return {
            message: 'User is successfully registered'
        }
    }
    
    async login(loginDto: LoginDTO){
        const {email, password} = loginDto;
        const [email_found] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]) as any[];
        const user = email_found[0];

        if (!user){
            throw new UnauthorizedException('Invalid email')
        }
        const password_match = await bcrypt.compare(password, user.password)
        
        if (!password_match){
            throw new UnauthorizedException('Wrong password')
        }

        const token = jwt.sign(
            {
                id: user.id, 
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1d'
            }
        );
        return {
            message: 'Login successful',
            token,
            role: user.role
        }
    }
}
