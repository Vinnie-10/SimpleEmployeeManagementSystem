import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDTO{
    @ApiProperty()
    department_id!: number;
    @ApiProperty()
    name!: string;
    @ApiProperty()
    email!: string;
    @ApiProperty()
    phone_number!: string;
    @ApiProperty()
    address!: string;
    @ApiProperty()
    position!: string;
}