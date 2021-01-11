import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import Event from '../structures/Event';
import ThizzClient from '../structures/Client';

export default class CommandHandler {
    public client: ThizzClient;
    public commands: Collection<string, Event>;

    constructor (client: ThizzClient) {
        this.client = client;
        this.commands = new Collection();
    }

    load () {
        const files = readdirSync(`${__dirname}/../commands`);
        files.forEach((file) => {
            const CustomEvent = require(`../commands/${file}`);
            const [commandName] = file.split('.');
            // eslint-disable-next-line new-cap
            const command = new CustomEvent.default(this.client);
            this.commands.set(commandName, command);
        });
        this.client.interactionsHandler.createCommand({
            name: 'time',
            description: 'Get the current time in Thizz Land!'
        }, process.env.THIZZ_SERVER);
        return this;
    }
};
