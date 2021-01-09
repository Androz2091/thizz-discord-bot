import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

interface HostArguments {
    name: string;
};

class HostCommand extends Command {
    constructor() {
        super('host', {
            aliases: ['host', 'h'],
            args: [
                {
                    id: 'name',
                    prompt: {
                        start: 'How should I call your channel?',
                        time: 60000,
                        timeout: ':x: You did not reply in time. Please retry.'
                    }
                }
            ],
            typing: true
        });
    }

    async exec (message: Message, args: HostArguments) {
        
        const hasHostRole = message.member?.roles.cache.has(process.env.HOST_ROLE!)!;
        if (!hasHostRole) return message.reply(':x: You are not allowed to use this command.');

        const server = this.client.guilds.cache.get(process.env.THIZZ_SERVER!);
        server?.channels.create(args.name, {
            type: 'voice',
            permissionOverwrites: [
                {
                    id: message.guild?.id!,
                    deny: ['SPEAK']
                },
                {
                    id: process.env.HOST_ROLE!,
                    allow: ['PRIORITY_SPEAKER','MUTE_MEMBERS','DEAFEN_MEMBERS']
                }
            ],
            parent: process.env.HOST_CATEGORY
        }).then((channel) => {
            channel.createInvite().then((invite) => {
                message.channel.send(`:white_check_mark: Your channel ${args.name} has been created. Click the invite to join it! ${invite.url}`);
            });
        });

    }
}

export default HostCommand;
