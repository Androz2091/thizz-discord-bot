import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';

export default class TimeCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'time',
            description: 'Get the current time in Thizz land!',
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
