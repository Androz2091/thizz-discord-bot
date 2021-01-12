import { CommandContext, SlashCommand } from 'slash-create';
import ThizzClient from '../structures/Client';

export default class HostCommand extends SlashCommand {
    public client: ThizzClient;

    constructor (client: ThizzClient) {
        super(client.slashCommandHandler, {
            name: 'host',
            description: 'Create a host channel in the server!',
            options: [
                {
                    name: 'name',
                    description: 'The name of the channel to create',
                    required: true,
                    type: 3
                }
            ],
            guildID: process.env.THIZZ_SERVER!
        });

        this.client = client;
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run (ctx: CommandContext) {
        const hasHostRole = ctx.member?.roles.some((roleID) => roleID === process.env.HOST_ROLE!)!;
        if (!hasHostRole) {
            ctx.send(':x: You are not allowed to use this command.', {
                ephemeral: true,
                includeSource: false
            });
            return;
        };

        const server = this.client.guilds.cache.get(process.env.THIZZ_SERVER!);
        server?.channels.create('s', {
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
                ctx.send(`:white_check_mark: Your channel ${'s'} has been created. Click the invite to join it! ${invite.url}`, {
                    includeSource: true
                });
            });
        });
    }
};
