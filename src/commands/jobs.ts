import { TextChannel } from 'discord.js';
import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import jobs from '../assets/jobs.json';
import { client } from '../bot';

export default class JobsCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'jobs',
            description: 'Displays the list of the available Jobs in Thizz Land!',
            guildID: process.env.THIZZ_SERVER!
        });
    }
    async run (ctx: CommandContext) {

        const category = (client.channels.cache.get(ctx.channelID) as TextChannel).parentID;
        if (category !== process.env.GANG_CAT) {
            ctx.send('Commands can only be executed in the Gang Life category.', {
                includeSource: false,
                ephemeral: true
            });
        }

        ctx.send(
            'Here is the list of the available jobs! Use \`/apply\` to apply for a job!\n\n'+
            jobs.reverse().map((job) => `${job.name} - $${job.salary} per hour`).join('\n')
        , {
            includeSource: true
        });
    }
}
