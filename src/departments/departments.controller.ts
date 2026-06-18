import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentDTO } from './dto/dept.dto';
import { JWTAuthGuard } from 'src/guard/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('departments')
export class DepartmentsController {
    constructor (private readonly deptService:DepartmentsService){}

    @Get('')
    async getDepartment(){
        return this.deptService.read()
    }

    @Post('/create')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    async createDepartment(@Body() body: DepartmentDTO){
        return this.deptService.create(body.name)
    }

    @Patch('/update/:id')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    async updateDepartment(@Param('id') id:string, @Body() body: DepartmentDTO){
        return this.deptService.update(id, body.name)
    }

    @Delete('/delete/:id') 
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    async deleteDepartment(@Param('id') id:string){
        return this.deptService.delete(id);
    }
}
