import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import pool from '../database/db';
import { CreateEmployeeDTO } from './dto/createEmployee.dto';
import { UpdateEmployeeDTO } from './dto/updateEmployee.dto';

@Injectable()
export class EmployeesService {
    async addEmployee(body: CreateEmployeeDTO){
        const {department_id, name, email, phone_number, address, position} = body;

        const [exist] = await pool.execute('SELECT id FROM employee WHERE email = ?', [email]) as any[];
        if (exist.length !== 0){
            throw new ConflictException(`${email} has previously been registered.`)
        }
        const [dept] = await pool.execute(`SELECT id FROM department WHERE id = ?`, [department_id]) as any[];
        if (dept.length === 0){
            throw new NotFoundException(`There is no department with ID ${department_id}`)
        }
        const [result] = await pool.execute(`INSERT INTO employee (department_id, name, email, phone_number, address, position) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [department_id, name, email, phone_number, address, position]) as any;
        return {
            message: `${name} with has successfully be registered to the database!`, 
            id: result.insertId}
    }

    async getEmployee(){
        const [exist] = await pool.execute('SELECT * FROM employee') as any[];
        if (exist.length === 0){
            return "There is no employee yet."
        }
        return exist;
    }

    async updateEmployee(id: string, body: UpdateEmployeeDTO){
        const [exist] = await pool.execute(`SELECT id FROM employee WHERE id = ?`, [id]) as any[];
        if (exist.length === 0){
            throw new NotFoundException(`Employee with ID ${id} is not found.`)
        }
        const {department_id, name, email, phone_number, address, position} = body;
        
        if (department_id !== undefined && department_id !== null){
            const [dept] = await pool.execute(`SELECT id FROM department WHERE id = ?`, [department_id]) as any[];
            if (dept.length === 0){
                throw new NotFoundException(`There is no department with ID ${department_id}`)
            }  
        }

        if (email !== undefined && email !== null) {
            const [emailExist] = await pool.execute(`SELECT id FROM employee WHERE email = ? AND id != ?`, [email, id]) as any[];
            if (emailExist.length > 0) {
                throw new ConflictException(`${email} is already used by another employee`);
            }
        }

        await pool.execute(`UPDATE employee SET 
                department_id = COALESCE(?, department_id),
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                phone_number = COALESCE(?, phone_number),
                address = COALESCE(?, address),
                position = COALESCE(?, position)
            WHERE id = ?`, 
            [
                department_id ?? null,
                name ?? null,
                email ?? null,
                phone_number ?? null,
                address ?? null,
                position ?? null,
                id,
            ]);
        return { 
            message: `Employee with ID ${id} has successfully be updated.`
        }
    }

    async deleteEmployee(id: string){
        const [exist] = await pool.execute('SELECT name FROM employee WHERE id = ?', [id]) as any[];
        if (exist.length === 0){
            throw new NotFoundException(`There is no employee with ID ${id}.`)
        }
        await pool.execute('DELETE FROM employee WHERE id = ?', [id]);
        return `Employee with id ${id} has been deleted.`
    }
}
