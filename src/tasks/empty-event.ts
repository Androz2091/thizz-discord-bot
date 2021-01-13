import chalk from 'chalk';
import { Snowflake } from 'discord.js';
import { CategoryChannel } from 'discord.js';
import type ThizzClient from '../structures/Client';
import Task from '../structures/Task';

export default class AutoroleTask extends Task {
    public emptyChannels: Set<Snowflake> = new Set();

    constructor (client: ThizzClient) {
        super(client);
        this.interval = 10000;
    }

    async run () {
        const server = this.client.guilds.cache.get(process.env.THIZZ_SERVER!);
        const category = server?.channels.cache.get(process.env.HOST_CHANNELS_CATEGORY!) as CategoryChannel;
        category.children.forEach((channel) => {
            if (channel.members.size === 0) {
                const shouldBeDeleted = this.emptyChannels.has(channel.id);
                if (shouldBeDeleted) {
                    console.log(chalk.green(`Event channel ${channel.name} has been deleted!`));
                    channel.delete();
                    this.emptyChannels.delete(channel.id);
                } else {
                    console.log(chalk.yellow(`Event channel ${channel.name} is going to be deleted!`));
                    this.emptyChannels.add(channel.id);
                }
            } else {
                this.emptyChannels.delete(channel.id);
            }
        });
    }
};
