const db = require('../src/database');
const supertest = require('supertest');
const app = require('../src/app');

const cleanDatabase = async () => {
  await db.query('DELETE FROM sessions');
  await db.query('DELETE FROM wallet');
  await db.query('DELETE FROM users');
}

beforeAll(cleanDatabase);
afterAll(async () => {
  await cleanDatabase();
  db.end();
})

let token = null;

describe('User sign-up and sign-in to get token', () => {
	it('should users sign-up', async () => {
		const body = {
      name: 'Teste',
      email: 'teste@gmail.com',
      password: 'teste123',
      confirmPassword: 'teste123'
    };

    const responseExpect = {
      name: 'Teste',
      email: 'teste@gmail.com',
    }
	
		const response = await supertest(app).post('/api/users/sign-up').send(body);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(responseExpect);
  });
  it('should user sign-in', async () => {
		const body = {
      email: 'teste@gmail.com',
      password: 'teste123'
    };
	
		const response = await supertest(app).post('/api/users/sign-in').send(body);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    token = response.body.token;
    userId = response.body.userId;
  });
});

describe('GET /user/wallet', () => {
	it('should return 200 to get all obj user wallet', async () => {
		const response = await supertest(app).get('/api/user/wallet').set('Authorization',`Bearer ${token}`)
    expect(response.status).toBe(200);
    expect(response.body.records).toBeTruthy();
    expect(response.body.total).toBeTruthy();
  });

  it('should return 401 to wrong token', async () => {
		const response = await supertest(app).get('/api/user/wallet').set('Authorization',`Bearer lalala`)
    expect(response.status).toBe(401);
  });

  it('should return 401 forgot token', async () => {
		const response = await supertest(app).get('/api/user/wallet')
    expect(response.status).toBe(401);
  });
});