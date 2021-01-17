import { TextChannel } from 'discord.js';
import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import jobs from '../assets/jobs.json';
import { client } from '../bot';
import { getUser, updateUser } from '../database/models/User';

const applyCooldown = 60000; // 1 hour in game time

export default class ApplyCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'apply',
            description: 'Apply for a job!',
            options: [
                {
                    name: 'job',
                    description: 'The job you want to apply for',
                    type: 3,
                    choices: jobs.map((job) => ({ name: job.name, value: job.name }))
                }
            ],
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

        const job = ctx.options.job as string;
        const userData = await getUser(ctx.member.id);
        if (userData.job) {
            ctx.send('You already have a job, use `/quit` to quit your job and apply again.', {
                includeSource: false,
                ephemeral: true
            });
            return;
        }

        const lastApplyAt = new Date(userData.lastApplyAt).getTime();
        const cooldownEnd = lastApplyAt + applyCooldown;
        const cooldown = cooldownEnd > Date.now();
        if (cooldown) {
            ctx.send('You can only apply for a job every one hour in game time, retry in ' + ((cooldownEnd - Date.now())/1000).toFixed(0) + ' seconds.', {
                includeSource: true
            });
            return;
        }

        const jobData = jobs.find((j) => j.name === job)!;
        const hasJob = Math.random() < jobData.chance / 100;
        if (hasJob) {
            updateUser(ctx.member.id, {
                job: jobData.name,
                lastApplyAt: new Date().toISOString()
            });

            ctx.send(':tada: Congratulations, you got the job! Get your salary ' + jobData.salary + ' every hour by using `/work`!', {
                includeSource: true,
                ephemeral: false
            });
        } else {
            updateUser(ctx.member.id, {
                lastApplyAt: new Date().toISOString()
            });

            ctx.send(':x: Your application has been rejected! You will be able to submit a new one in one hour.', {
                includeSource: true,
                ephemeral: false
            });
        }
    }
}
