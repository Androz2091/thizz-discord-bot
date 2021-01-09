import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping']
        });
    }

    async exec(message: Message) {
        return message.channel.send(`Latency: **\`${this.client.ws.ping}ms\`**`)
    }
}

export default PingCommand;
