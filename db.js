/* ===================================================
 * ======             CONFIGURATION          =========
 * =================================================*/
const pg = require('pg');
const url = require('url');

let configs;

if( process.env.DATABASE_URL ) {
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(':');

    configs = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true
    };

} else {
    configs = {
        user: 'chuasweechin',
        host: '127.0.0.1',
        database: 'health_db',
        port: 5432
    };
}

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
    console.log('idle client error', err.message, err.stack);
});

 /* ===================================================
 * ======         REQUIRE MODEL FILES          ========
 * ==================================================*/
const userModelsFunction = require('./models/user');
const userModelsObject = userModelsFunction(pool);

const weightModelsFunction = require('./models/weight');
const weightModelsObject = weightModelsFunction(pool);

const goalModelsFunction = require('./models/goal');
const goalModelsObject = goalModelsFunction(pool);

const calorieModelsFunction = require('./models/calorie');
const calorieModelsObject = calorieModelsFunction(pool);

/* ===================================================
 * ======             MODULE EXPORTS          ========
 * =================================================*/
module.exports = {
  //make queries directly from here
    queryInterface: function (text, params, callback) {
        return pool.query(text, params, callback);
    },
    pool: pool,
    weight: weightModelsObject,
    user: userModelsObject,
    goal: goalModelsObject,
    calorie: calorieModelsObject
};