import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './dto/createEmployee.dto';
import { UpdateEmployeeDTO } from './dto/updateEmployee.dto';
import { JWTAuthGuard } from '../guard/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
    constructor (private readonly employeeService:EmployeesService){}
    
    @Get('')
    @UseGuards(JWTAuthGuard)
    async getEmployee(){
        return this.employeeService.getEmployee();
    }

    @Post('/create')
    @UseGuards(JWTAuthGuard)
    async addEmployee(@Body() body: CreateEmployeeDTO){
        return this.employeeService.addEmployee(body);
    }

    @Patch('/update/:id')
    @UseGuards(JWTAuthGuard)
    async updateEmployee(@Param('id') id: string, @Body() body: UpdateEmployeeDTO){
        return this.employeeService.updateEmployee(id, body);
    }

    @Delete('/delete/:id')
    @UseGuards(JWTAuthGuard)
    async deleteEmployee(@Param('id') id: string){
        return this.employeeService.deleteEmployee(id);
    }
}