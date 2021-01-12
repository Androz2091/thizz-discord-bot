import { readdirSync } from 'fs';
import { SlashCommand } from 'slash-create';
import ThizzClient from '../structures/Client';

export default class CommandHandler {
    public client: ThizzClient;

    constructor (client: ThizzClient) {
        this.client = client;
    }

    load () {
        const commands: SlashCommand[] = [];
        const files = readdirSync(`${__dirname}/../commands`);
        files.forEach((file) => {
            const CustomCommand = require(`../commands/${file}`);
            // eslint-disable-next-line new-cap
            const command = new CustomCommand.default(this.client);
            commands.push(command);
        });
        this.client.slashCommandHandler.registerCommands(commands);
        return this;
    }
};
