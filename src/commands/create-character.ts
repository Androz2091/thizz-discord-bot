import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';
import { createUser, getUser } from '../database/models/User';

export default class CreateCharacterCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'create-character',
            description: 'Create your character!',
            guildID: process.env.THIZZ_SERVER!
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run (ctx: CommandContext) {
        const userData = await getUser(ctx.member.id);
        if (userData) {
            ctx.send('Your character is already created!', {
                includeSource: false,
                ephemeral: true
            });
        }
        await createUser(ctx.member.id);
        ctx.send('Your character has been created!', {
            includeSource: true
        });
    }
};
