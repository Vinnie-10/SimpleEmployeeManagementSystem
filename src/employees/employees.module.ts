import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { AuthModule } from 'src/auth/auth.module';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [AuthModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, Reflector]
})
export class EmployeesModule {}
