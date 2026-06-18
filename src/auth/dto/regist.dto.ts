import { ApiProperty } from "@nestjs/swagger";

export class RegistDTO{
    @ApiProperty()
    name!: string;
    @ApiProperty()
    email!: string;
    @ApiProperty()
    password!: string;
    @ApiProperty()
    role!: 'Boss' | 'HR';
}