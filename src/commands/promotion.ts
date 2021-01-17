import { TextChannel } from 'discord.js';
import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import { client } from '../bot';
import { getUser, updateUser } from '../database/models/User';

export default class PromotionCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'promotion',
            description: 'Ask for a promotion!',
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
            return;
        }

        const userData = await getUser(ctx.member.id);
        if (!userData.job) {
            ctx.send('You currently don\'t have any job, use `/apply` to apply for a job.', {
                includeSource: true,
                ephemeral: true
            });
            return;
        } else {
            const requiredWorkTimes = (userData.workLevel || 1)* 10 + userData.workLevel * 2;
            if (userData.workTimes >= requiredWorkTimes) {
                ctx.send(`:tada: You get your promotion! You will now be paid **$2** additional per hour!`, {
                    includeSource: true,
                    ephemeral: false
                });
                updateUser(ctx.member.id, {
                    workLevel: userData.workLevel + 1
                });
            } else {
                ctx.send(`:x: You need to send \`/work\` **${requiredWorkTimes - userData.workTimes}** times before being able to get a promotion!`);
            }
        }
    }
};
