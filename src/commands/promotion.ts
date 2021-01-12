import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

export default class PromotionCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'promotion',
            description: 'Ask for a promotion!',
            guildID: process.env.THIZZ_SERVER!
        });
    }
    async run (ctx: CommandContext) {
    }
}
