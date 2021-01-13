import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import { getUser, updateUser } from '../database/models/User';

export default class QuitCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'quit',
            description: 'Quit your current job!',
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

            const previousJob = userData.job;

            updateUser(ctx.member.id, {
                job: null
            });

            ctx.send(':white_check_mark: You are no longer a ' + previousJob.toLocaleLowerCase() + '!', {
                includeSource: true,
                ephemeral: false
            });
        }
    }
};
