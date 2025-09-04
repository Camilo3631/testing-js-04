
jest.setTimeout(30000); // aumenta a 30s o más al inicio de tu archivo

// Este request viene de supertest
const request = require('supertest')
// Conexion hacia la base de datos
const { MongoClient } = require('mongodb');
// ponemos en marcha nuestra aplicación

const createApp = require('../src/app');
// configuramos nuestra base datos
const { config } = require('../src/config');


// Conexion para las pruebas E2E
const DB_NAME = config.dbName;
const MONGO_URI = config.dbUrl;


// estas son las pruebas para hello endpoit
describe('Test for books', () => {
    // tenemos nuestra app de forma global para todas nuestra pruebas
    let app = null;
    // tenemos nuestra instacia de servidor global
    let server = null;
    // Nos concetamos hacia la base datos
    let database = null;

    // antes de todas las pruebas are un beforeAll que realice requet
    beforeAll(async () => {
        app = createApp();
        // nuestro aplicación corre en un puerto especifico 3001
        server = app.listen(3002);
        const client = new MongoClient(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Conexion y cliente
        await client.connect()
        // la base es igual al cliente y la base datos desada
        database = client.db(DB_NAME); 
    });
    // antes de correr todos nuestro casos de prueba va a cerrar la aplicación
    afterAll(async () => {
        await server.close();
        // es una funcion de expres

    })

    // Encerramos nuestro caso de prueba para get
    describe('test for [GET] /api/v1/books', () => {
        test('should return a list books"', async () => {  
         // Arrange
        // semilla de datos ( información)
        const seedData = await database.collection('books').insertMany([
            {
              name: 'Book1',
              year: 1998,
              author: 'Kamil',
            },
            {
             name: 'Book1',
             year: 2020,
             author: 'Kamil',
            }
        ]);
        // Act 
            return request(app)
                .get('/api/v1/books') // ruta como string
                .expect(200) // si todo va bien 200ok
                .then(({ body }) => {
                  console.log(body)
                  expect(body.length).toEqual(seedData.insertedCount);
              });
         });
    });
});

