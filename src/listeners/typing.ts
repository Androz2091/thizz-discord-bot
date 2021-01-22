import { Listener } from 'discord-akairo';
import { DMChannel } from 'discord.js';
import { CategoryChannel, Collection, TextChannel, User, Snowflake } from 'discord.js';
import { client } from '../bot';

export default class ReactionAddListener extends Listener {
    constructor () {
        super('typing', {
            emitter: 'client',
            event: 'typingStart'
        });
    }

    async exec (channel: TextChannel|DMChannel, user: User) {
        console.log('typing');
        if (user.bot) return;
        if (channel.type === 'dm') {
            const ticketsCategory = client.channels.cache.get(process.env.TICKETS_CATEGORY!) as CategoryChannel;
            const ticketChannels = ticketsCategory.children as Collection<Snowflake, TextChannel>;
            if (!ticketChannels.some((channel) => channel.topic?.includes(user.id) || false)) return;
            const ticketChannel = ticketChannels.find((channel) => channel.topic?.includes(user.id) || false)!;
            ticketChannel.startTyping();
            client.typingChannels.set(ticketChannel.id, ticketChannel);
            setTimeout(() => {
                ticketChannel.stopTyping(true);
            }, 10000);
        }
    }
};
