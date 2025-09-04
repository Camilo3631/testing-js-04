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
    let client = null; // guardamos el MongoClient para cerrarlo después

    // Antes de todas las pruebas: levantar app y conectar base de datos
    beforeAll(async () => {
        app = createApp();
        server = app.listen(3002); // levantar servidor en puerto específico

        client = new MongoClient(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        database = client.db(DB_NAME);
    });

    // Después de todas las pruebas: cerrar servidor y base de datos
    afterAll(async () => {
        await server.close();
        await client.close(); // cerrar conexión a MongoDB
    });

    // Prueba para GET /api/v1/books
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
                    console.log(body);
                    expect(body.length).toEqual(seedData.insertedCount);
                });
        });
    });
});
