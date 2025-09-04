jest.setTimeout(30000); // aumenta a 30s al inicio

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
    let client = null; // MongoClient separado

    beforeAll(async () => {
        // Levantar la aplicación
        app = createApp();
        server = app.listen(3002);

        // Conectar a MongoDB
        client = new MongoClient(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        database = client.db(DB_NAME);
    });

    // Solo cerrar el servidor, MongoDB se mantiene abierto para CI/CD
    afterAll(async () => {
        await server.close();
        // No cerramos MongoDB aquí porque en GitHub Actions el contenedor termina automáticamente
    });

    describe('test for [GET] /api/v1/books', () => {
        test('should return a list of books', async () => {
            // Semilla de datos
            const seedData = await database.collection('books').insertMany([
                { name: 'Book1', year: 1998, author: 'Kamil' },
                { name: 'Book2', year: 2020, author: 'Kamil' },
            ]);

            // Hacer request y validar
            return request(app)
                .get('/api/v1/books')
                .expect(200)
                .then(({ body }) => {
                    expect(body.length).toEqual(seedData.insertedCount);
                });
        });
    });
});