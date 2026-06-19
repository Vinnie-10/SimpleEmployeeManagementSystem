import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { describe } from 'node:test';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let BossToken: string;
  let HRToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  
  describe('POST /auth/login', () => {
    it('Boss should login and return a token', async() => {
      const response = await request(app.getHttpServer())
                      .post('/auth/login')
                      .send({ email: 'boss@ems.com', password: 'boss123'})
                      .expect(201);
      expect(response.body.token).toBeDefined();
      BossToken = response.body.token;
    });
    it('HR should login and return a token', async() => {
      const response = await request(app.getHttpServer())
                      .post('/auth/login')
                      .send({ email: 'hr@ems.com', password: 'hr12345'})
                      .expect(201);
      expect(response.body.token).toBeDefined();
      HRToken = response.body.token;
    });

    it('should fail with wrong email', async() => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'bos@ems.com', password: 'boss123'})
        .expect(401);
    });

    it('should fail with wrong password', async() => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'boss@ems.com', password: 'bos123'})
        .expect(401);
    });
  });

  describe('POST /auth/regist', () => {
    it('Boss should be able to register a new user', async() => {
      await request(app.getHttpServer())
        .post('/auth/regist')
        .set('Authorization', `Bearer ${BossToken}`)
        .send({ name: 'New HR', email: `newhr@ems.com`, password: 'newhr123', role: 'HR' })
        .expect(201);
    })

    it('HR should NOT be able to register (403)', async () => {
      await request(app.getHttpServer())
        .post('/auth/regist')
        .set('Authorization', `Bearer ${HRToken}`)
        .send({ name: 'Test', email: 'tes@ems.com', password: 'test123', role: 'HR' })
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .post('/auth/regist')
        .send({ name: 'Another', email: `another${Date.now()}@ems.com`, password: 'test123', role: 'HR' })
        .expect(401);
    });
  })

  describe('GET /employees', () => {
    it('Boss should get employees', async () => {
      await request(app.getHttpServer())
        .get('/employees')
        .set('Authorization', `Bearer ${BossToken}`)
        .expect(200);
    });

    it('HR should get employees', async () => {
      await request(app.getHttpServer())
        .get('/employees')
        .set('Authorization', `Bearer ${HRToken}`)
        .expect(200);
    });

    it('should return 401 without token', async() => {
      await request (app.getHttpServer())
        .get('/employees')
        .expect(401)
    })

    it('should return 401 with invalid token', async() => {
      await request (app.getHttpServer())
        .get('/employees')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401)
    });
  });

  describe('DELETE /employees/:id', () => {
    it('Boss should be able to delete an employee', async () => {
      const response = await request(app.getHttpServer())
            .post('/employees/create')
            .set('Authorization', `Bearer ${BossToken}`)
            .send({
                department_id: 1,
                name: 'Test',
                email: `delete1@ems.com`,
                phone_number: '08123456789',
                address: 'Bandung',
                position: 'Intern',
            });
      const id = response.body.id;
      
      await request(app.getHttpServer())
        .delete(`/employees/delete/${id}`)
        .set('Authorization', `Bearer ${BossToken}`)
        .expect(200);
    });

    it('HR should be able to delete an employee', async () => {
      const response = await request(app.getHttpServer())
            .post('/employees/create')
            .set('Authorization', `Bearer ${BossToken}`)
            .send({
                department_id: 1,
                name: 'Test',
                email: `delete2@ems.com`,
                phone_number: '08123456789',
                address: 'Bandung',
                position: 'Intern',
            });
      const id = response.body.id;
      await request(app.getHttpServer())
        .delete(`/employees/delete/${id}`)
        .set('Authorization', `Bearer ${HRToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .delete('/employees/delete/999')
        .expect(401);
    });
  });

  describe('GET /departments', () => {
    it('should get departments without token', async () => {
      await request(app.getHttpServer())
          .get('/departments')
          .expect(200);
    });
  });

  describe('PATCH /employees/:id', () => {
    it('Boss should be able to update an employee', async () => {
      const response = await request(app.getHttpServer())
          .post('/employees/create')
          .set('Authorization', `Bearer ${BossToken}`)
          .send({
              department_id: 1,
              name: 'Test Employee',
              email: `test1@ems.com`,
              phone_number: '08123456789',
              address: 'Jakarta',
              position: 'Staff',
          });
      const id = response.body.id;

      await request(app.getHttpServer())
          .patch(`/employees/update/${id}`)
          .set('Authorization', `Bearer ${BossToken}`)
          .send({ name: 'Updated Name' })
          .expect(200);
    });

    it('HR should be able to update an employee', async () => {
      const response = await request(app.getHttpServer())
          .post('/employees/create')
          .set('Authorization', `Bearer ${BossToken}`)
          .send({
              department_id: 1,
              name: 'Test Employee',
              email: `test2@ems.com`,
              phone_number: '08123456789',
              address: 'Jakarta',
              position: 'Staff',
          });
      const id = response.body.id;
      await request(app.getHttpServer())
          .patch(`/employees/update/${id}`)
          .set('Authorization', `Bearer ${HRToken}`)
          .send({ position: 'Senior Manager' })
          .expect(200);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
          .patch('/employees/update/999')
          .send({ name: 'Updated Name' })
          .expect(401);
    });

    it('should return 404 if employee does not exist', async () => {
      await request(app.getHttpServer())
          .patch(`/employees/update/99999`)
          .set('Authorization', `Bearer ${BossToken}`)
          .send({ name: 'Updated Name' })
          .expect(404);
    });
  });
});
