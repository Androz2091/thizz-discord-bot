import ThizzClient from './structures/Client';
import dotenv from 'dotenv';
dotenv.config();

export const client: ThizzClient = new ThizzClient();

client.start();
