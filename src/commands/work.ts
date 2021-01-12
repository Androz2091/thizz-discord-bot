import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import { getUser, updateUser } from '../database/models/User';
import jobs from '../assets/jobs.json';

const workCooldown = 60000;

export default class WorkCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'work',
            description: 'Work and claim your salary!',
            guildID: process.env.THIZZ_SERVER!
        });
    }
    async run (ctx: CommandContext) {
        const userData = await getUser(ctx.member.id);
        if (!userData.job) {
            ctx.send('You currently don\'t have any job, use `/apply` to apply for a job.', {
                includeSource: false,
                ephemeral: true
            });
            return;
        } else {

            const lastWorkAt = new Date(userData.lastWorkAt).getTime();
            const cooldownEnd = lastWorkAt + workCooldown;
            const cooldown = cooldownEnd > Date.now()
            if (cooldown) {
                ctx.send('You can only work every one hour in game time, retry in ' + ((cooldownEnd - Date.now())/1000).toFixed(0) + ' seconds.', {
                    includeSource: false,
                    ephemeral: true
                });
                return;
            }

            const jobData = jobs.find((j) => j.name === userData.job)!;

            updateUser(ctx.member.id, {
                workTimes: userData.workTimes+1,
                money: userData.money + jobData.salary,
                lastWorkAt: new Date().toISOString()
            });

            ctx.send(':tada: You worked and were paid **$' + jobData.salary + '**!', {
                includeSource: true,
                ephemeral: false
            });
        }
    }
}
