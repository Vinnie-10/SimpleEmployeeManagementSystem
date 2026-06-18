import { ApiProperty } from "@nestjs/swagger";

export class DepartmentDTO{
    @ApiProperty()
    name!: string;
}