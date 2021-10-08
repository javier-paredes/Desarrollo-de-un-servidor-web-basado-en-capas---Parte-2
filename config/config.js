const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV + '.env')
})

export default{
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.PORT || 8080,
    // File - Mongo
    PERSISTENCIA: process.env.PERSISTENCE || 'Mongo',
    GRAPHIQL: process.env.GRAPHIQL || 'true'
}