import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';
import { client } from '../bot';

export default class PingCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            description: 'Get the bot\'s latency',
            guildID: process.env.THIZZ_SERVER!
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run (ctx: CommandContext) {
        ctx.send(`Pong! Latency: \`${client.ws.ping}ms\``, {
            includeSource: true
        });
    }
};
