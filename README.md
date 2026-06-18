## Project Pattern
Simple Employee Management System ini menggunakan **Layered Architecture**, yang memisahkan aplikasi ke dalam beberapa layer, seperti Controller dan Service. Pada pattern ini, **Controller** bertugas untuk menangani request dan response dari client, sedangkan **Service** menangani business logic dan berkomunikasi langsung dengan database MySQL menggunakan `mysql2`.

Saya memilih pattern ini karena sistem dapat dibuat menjadi lebih maintainable dan readable karena setiap layer mempunyai tanggung jawab yang jelas. Selain itu, dengan pemisahan ini juga dapat mempermudah proses testing, debugging, dan pengembangan fitur baru nantinya.

## Project setup

```bash
$ npm install
$ npm run migrate
$ npm run seed
```

## Compile and run the project

```bash
$ npm run start:dev
```

## Run tests

```bash
$ npm run test:e2e
```
