import { Listener } from 'discord-akairo';
import { MessageEmbed, TextChannel } from 'discord.js';
import { client } from '../bot';
import { EMBED_COLOR } from '../util/Constants';

export default class ReadyListener extends Listener {
    constructor () {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec () {
        console.log(`${this.client.user?.tag} is now ready!`);

        const ticketChannel = client.channels.cache.get(process.env.CREATE_TICKET_CHANNEL!) as TextChannel;
        ticketChannel.messages.fetch().then((messages) => {
            if (messages.size === 0) {
                ticketChannel.send('Loading ticket message...').then((message) => {
                    const embed = new MessageEmbed()
                        .setTitle('🎟 Open a ticket here')
                        .setDescription('Add or remove a 🎟 emoji from this message to open a support ticket with the Discord staff team. Please only use this if you need to contact the mods about something on Discord. Scam reports will immediately be discarded and repeat offenders will be blacklisted from using the ticket system.')
                        .setColor(EMBED_COLOR);
                    message.edit(null, {
                        embed
                    }).then(() => {
                        message.react('🎟');
                    });
                });
            }
        });
    }
};
