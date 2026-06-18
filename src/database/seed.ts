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
    console.log('Seeding successful')
    process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});