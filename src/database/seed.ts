import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from './db';

dotenv.config()

async function seed(){
    const bossPassword = await bcrypt.hash('boss123', 10);
    const hrPassword = await bcrypt.hash('hr12345', 10);

    await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        ['Boss', 'boss@ems.com', bossPassword, 'Boss']
    )
    await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        ['HR Team', 'hr@ems.com', hrPassword, 'HR']
    )
    await pool.execute(
        'INSERT INTO department (name) VALUES (?)',
        ['Business Development']
    )
    await pool.execute(
        'INSERT INTO employee (department_id, name, email, phone_number, address, position) VALUES (?, ?, ?, ?, ?, ?)',
        [1, 'Barney', 'barney@ems.com', '08123456789', 'Bandung', 'Manager']
    )
    await pool.execute(
        'INSERT INTO employee (department_id, name, email, phone_number, address, position) VALUES (?, ?, ?, ?, ?, ?)',
        [1, 'Budi', 'budi@ems.com', '0898765890', 'Surabaya', 'Manager']
    )

    console.log('Seeding successful')
    process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});