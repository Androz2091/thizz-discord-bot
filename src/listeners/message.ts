import { Listener } from 'discord-akairo';
import { WebhookMessageOptions } from 'discord.js';
import { CategoryChannel, Collection, Message, Snowflake, TextChannel } from 'discord.js';
import { client } from '../bot';

export default class MessageListener extends Listener {
    constructor () {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    createWebhookOptions (message: Message): WebhookMessageOptions {
        return {
            files: message.attachments.map((attachment) => ({ name: attachment.name!, attachment: attachment.url })),
            avatarURL: message.author.displayAvatarURL(),
            username: message.author.username,
            disableMentions: 'all'
        };
    }

    async exec (message: Message) {
        if (message.author.bot) return;
        if (message.channel.type === 'dm') {
            const ticketsCategory = client.channels.cache.get(process.env.TICKETS_CATEGORY!) as CategoryChannel;
            const ticketChannels = ticketsCategory.children as Collection<Snowflake, TextChannel>;
            if (!ticketChannels.some((channel) => channel.topic?.includes(message.author.id) || false)) return;
            const ticketChannel = ticketChannels.find((channel) => channel.topic?.includes(message.author.id) || false)!;
            if (client.typingChannels.get(ticketChannel.id)) {
                ticketChannel.stopTyping(true);
                client.typingChannels.delete(ticketChannel.id);
            }
            const webhooks = await ticketChannel.fetchWebhooks();
            await webhooks.first()?.send(message.content, this.createWebhookOptions(message));
            message.react('📨');
        } else if (message.channel.name.startsWith('ticket-')) {
            const relatedUserID = message.channel.topic!.match(/\((\d{16,32})\)/)![1];
            if (relatedUserID) {
                message.delete();
                const webhooks = await message.channel.fetchWebhooks();
                await webhooks.first()?.send(message.content, this.createWebhookOptions(message));
                const user = await client.users.fetch(relatedUserID);
                user.send(`**${message.author.tag}**: ${message.content}`, {
                    files: message.attachments.map((attachment) => ({ name: attachment.name!, attachment: attachment.url }))
                });
            }
        }
    }
};
