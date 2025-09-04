jest.setTimeout(30000); // aumenta a 30s al inicio del archivo

const request = require('supertest');
const { MongoClient } = require('mongodb');
const createApp = require('../src/app');
const { config } = require('../src/config');

const DB_NAME = config.dbName;
const MONGO_URI = config.dbUrl;

describe('Test for books', () => {
    let app = null;
    let server = null;
    let database = null;
    let client = null; // <--- MongoClient separado

    beforeAll(async () => {
        app = createApp();
        server = app.listen(3002);

        client = new MongoClient(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        database = client.db(DB_NAME);
    });

    afterAll(async () => {
        await server.close();
        await client.close(); // <--- cerrar MongoDB correctamente
    });

    describe('test for [GET] /api/v1/books', () => {
        test('should return a list of books', async () => {
            // Arrange: insertar datos de prueba
            const seedData = await database.collection('books').insertMany([
                { name: 'Book1', year: 1998, author: 'Kamil' },
                { name: 'Book2', year: 2020, author: 'Kamil' },
            ]);

            // Act: hacer request y validar
            return request(app)
                .get('/api/v1/books')
                .expect(200)
                .then(({ body }) => {
                    console.log(body);
                    expect(body.length).toEqual(seedData.insertedCount);
                });
        });
    });
});
