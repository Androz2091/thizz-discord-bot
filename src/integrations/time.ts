import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';

export default class HelloCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'host',
            description: 'Create a new host channel',
            guildID: process.env.THIZZ_SERVER!
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run (ctx: CommandContext) {
        ctx.send(`You need to have the Host role to create a new host channel!`, {
            includeSource: false,
            ephemeral: true
        });
    }
};
