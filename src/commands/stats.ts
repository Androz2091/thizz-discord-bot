import { Snowflake, MessageEmbed } from 'discord.js';
import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import { client } from '../bot';
import { getUser } from '../database/models/User';
import jobs from '../assets/jobs.json';

export default class StatsCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'stats',
            description: 'Access your money and health!',
            options: [
                {
                    name: 'user',
                    description: 'Which user\'s stats do you want to get?',
                    type: 6,
                    required: false
                }
            ]
        });
    }

    async run (ctx: CommandContext) {
        const userID = ctx.options.user as Snowflake || ctx.member.id;
        const isAuthor = userID === ctx.member.id;

        const user = await client.users.fetch(userID).catch(() => {});
        const tag: string = user ? user.tag : userID;

        const health = 100;
        const userData = await getUser(userID);
        const jobData = userData.job ? jobs.find((j) => j.name === userData.job) : null;

        const embed = new MessageEmbed()
            .addField(`Money`, isAuthor ? `You currently have **$${userData.money}** at the bank! :moneybag:` : `${user} has currently **$${userData.money}** at the bank! :moneybag:`)
            .addField('Health', isAuthor ? `You are currently **${health}%** healthy! :heart_decoration:` : `${user} is currently **${health}%** healthy! :heart_decoration:`)
            .addField('Job', 
                isAuthor ?
                    jobData ? `You are currently a **${jobData.name}**, paid **$${jobData.salary}** per hour! :man_in_tuxedo:`
                            : `You currently have no jobs! :man_in_tuxedo:`
                    :
                    jobData ? `${user} is currently a **${jobData.name}**, paid **$${jobData.salary}** per hour! :man_in_tuxedo:`
                            : `${user} currently has no jobs! :man_in_tuxedo:`
            )
            .setColor('#36393F');

        ctx.send(`<@${ctx.member.id}>, here are ${tag}'s stats!`, {
            includeSource: true,
            ephemeral: false,
            embeds: [
                embed.toJSON()
            ]
        });
    }
}
