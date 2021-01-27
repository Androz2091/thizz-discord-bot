import { TextChannel } from 'discord.js';
import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';
import { client } from '../bot';

export default class CloseCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'close',
            description: 'Close the current ticket',
            guildID: process.env.THIZZ_SERVER!
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run (ctx: CommandContext) {
        const channel = client.channels.cache.get(ctx.channelID) as TextChannel;
        if (!channel.name.startsWith('ticket-')) {
            ctx.send('This channel is not a ticket channel!', {
                ephemeral: true,
                includeSource: false
            });
            return;
        }
        const relatedUserID = channel.topic!.match(/\((\d{16,32})\)/)![1];
        if (relatedUserID) {
            const user = await client.users.fetch(relatedUserID);
            user.send(':information_source: Your request has been closed by the Discord moderation team.');
        }
        channel.send('The ticket will be closed in 10 seconds');
        setTimeout(() => channel.delete(), 10000);
    }
};
