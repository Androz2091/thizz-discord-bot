import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';
import { client } from '../bot';

export default class HostCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'host',
            description: 'Create an event channel!',
            options: [
                {
                    name: 'name',
                    description: 'How should we call this channel?',
                    type: 3,
                    required: true
                }
            ],
            guildID: process.env.THIZZ_SERVER!
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run (ctx: CommandContext) {
        const hasHostRole = ctx.member?.roles.some((roleID) => roleID === process.env.HOST_ROLE!)!;
        if (!hasHostRole) {
            ctx.send('You must have the Host role to create an event channel.', {
                includeSource: false,
                ephemeral: true
            });
            return;
        }

        ctx.send(`Creating your channel...`, {
            includeSource: true
        });
        const server = client.guilds.cache.get(process.env.THIZZ_SERVER!);
        server?.channels.create(ctx.options.name as string, {
            type: 'voice',
            permissionOverwrites: [
                {
                    id: ctx.guildID,
                    deny: ['SPEAK']
                },
                {
                    id: process.env.HOST_ROLE!,
                    allow: ['PRIORITY_SPEAKER', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']
                }
            ],
            parent: process.env.HOST_CHANNELS_CATEGORY
        }).then((channel) => {
            channel.createInvite().then((invite) => {
                ctx.editOriginal(`:white_check_mark: Your channel ${ctx.options.name as string} has been created. Click the invite to join it! ${invite.url}`);
            });
        });
    }
}
