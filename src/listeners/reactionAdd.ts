import { Listener } from 'discord-akairo';
import { CategoryChannel, Collection, MessageReaction, TextChannel, User, Snowflake } from 'discord.js';
import { client } from '../bot';

export default class ReactionAddListener extends Listener {
    constructor () {
        super('reactionAdd', {
            emitter: 'client',
            event: 'messageReactionAdd'
        });
    }

    async exec (reaction: MessageReaction, user: User) {
        const ticketsCategory = client.channels.cache.get(process.env.TICKETS_CATEGORY!) as CategoryChannel;
        if (reaction.message.channel.id !== process.env.CREATE_TICKET_CHANNEL! || user.bot) return;
        const ticketChannels = ticketsCategory.children as Collection<Snowflake, TextChannel>;

        if (ticketChannels.some((channel) => channel.topic?.includes(user.id) || false)) {
            return user.send(`You already have a discussion opened! Send a message here and the mods will receive it.`);
        }

        const createdTicket = await ticketsCategory.guild.channels.create(`ticket-${user.username}`, {
            parent: ticketsCategory.id,
            topic: `This ticket has been opened by <@${user.id}> (${user.id})`,
            permissionOverwrites: [
                {
                    id: ticketsCategory.guild.id,
                    deny: ['VIEW_CHANNEL']
                }
            ]
        });
        createdTicket.send(`${user} opened a ticket. You will receive their messages here, and you will be able to reply by sending messages in this channel.`);
        await createdTicket.createWebhook(`ticket_${user.id}`);

        await user.send(`Hello ${user} :wave:\nThank you for opening this ticket. You can now chat with Discord mods by sending messages below. How can we help you?`);
    }
};
