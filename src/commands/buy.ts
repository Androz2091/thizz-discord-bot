import { TextChannel } from 'discord.js';
import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';
import { client } from '../bot';
import { getUser, updateUser } from '../database/models/User';
import { Food } from '../types/food';

export default class BuyCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'buy',
            description: 'Buy food to eat it later!',
            options: [
                {
                    type: 3,
                    name: 'food',
                    description: 'The type of food you want to buy!',
                    required: true
                }
            ],
            guildID: process.env.THIZZ_SERVER!
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async parseChannel (channel: TextChannel): Promise<Food[]> {
        await channel.messages.fetch({ limit: 100 });
        return channel.messages.cache.map((message) => {
            return message.content.split('\n').filter((e) => e.includes('$')).map((e) => ({ name: e.split('$')[0].trim(), price: parseInt(e.split('$')[1].split(' ')[0]), points: 0 }));
        }).flat();
    }

    async run (ctx: CommandContext) {
        const channel = client.channels.cache.get(ctx.channelID) as TextChannel;
        const menuChannel = channel.parent?.children.find((child) => ['menu', 'shop', 'stock'].includes(child.name)) as TextChannel;
        if (!menuChannel) {
            ctx.send('There is nothing to buy here!', {
                ephemeral: true,
                includeSource: false
            });
            return;
        }

        const userData = await getUser(ctx.member.id);

        const foods = await this.parseChannel(menuChannel);
        const foodName = ctx.options.food;
        const foodData = foods.find((food) => food.name === foodName);
        if (!foodData) {
            ctx.send('This type of food does not exist!', {
                ephemeral: true,
                includeSource: false
            });
            return;
        }

        if (foodData.price > userData.money) {
            ctx.send(`:x: You need **${foodData.price}** to buy this ${foodData.name}!`, {
                includeSource: true
            });
            return;
        }

        updateUser(ctx.member.id, {
            money: userData.money - foodData.price,
            foods: [...userData.foods, ...[foodData]]
        });
    }
};
