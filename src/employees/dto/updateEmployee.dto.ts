import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateEmployeeDTO{
    @ApiPropertyOptional({ example: null})
    department_id?: number;
    @ApiPropertyOptional({ example: null})
    name?: string;
    @ApiPropertyOptional({ example: null})
    email?: string;
    @ApiPropertyOptional({ example: null})
    phone_number?: string;
    @ApiPropertyOptional({ example: null})
    address?: string;
    @ApiPropertyOptional({ example: null})
    position?: string;
}