import ThizzClient from './core/client';
import dotenv from 'dotenv';
dotenv.config();

const client: ThizzClient = new ThizzClient();

client.start();
