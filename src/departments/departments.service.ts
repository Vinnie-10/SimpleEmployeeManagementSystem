import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import pool from '../database/db';

@Injectable()
export class DepartmentsService {
    async read(){
        const [exist] = await pool.execute('SELECT id, name FROM department') as any[];
        if (exist.length == 0){
            return { message: "There is no departments yet."}
        }
        return exist;
    }

    async create(name){
        const [exist] = await pool.execute('SELECT id FROM department WHERE name = ?', [name]) as any[];
        if (exist.length !== 0){
            throw new ConflictException(`${name} is already registered in the db.`)
        }
        const insertDept = await pool.execute('INSERT INTO department (name) VALUES (?)', [name]);
        return {
            message: `${name} is successfully saved`
        }
    }

    async update(id: string, name:string){
        const [exist] = await pool.execute('SELECT * FROM department WHERE id = ?', [id]) as any[];
        if (exist.length === 0){
            throw new NotFoundException(`Department with id ${id} is not found.`)
        }
        await pool.execute('UPDATE department SET name = ? WHERE id = ?', [name, id]);
        return { message: "Department has successfully been updated."}
    }

    async delete(id: string){
        const [exist] = await pool.execute('SELECT * FROM department WHERE id = ?', [id]) as any[];
        if (exist.length === 0){
            throw new NotFoundException(`Department with id ${id} is not found.`)
        }
        await pool.execute('DELETE FROM department WHERE id = ?', [id]);
        return { message: `Department with id ${id} has successfully be deleted.`}
    }
}
