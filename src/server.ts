
import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import connectDB from './db';

dotenv.config();

const server = http.createServer(app)
const port = process.env.PORT || 3000;

const startServer = async ()=> {
    try {
        if(typeof process.env.MONGO_URI === 'string'){
            await connectDB(process.env.MONGO_URI);
            server.listen(port, () => {
                console.log(`Server Listing on port ${port}`);
            });
        }
    } catch (error) {
        console.log(error)
    }
}

startServer();