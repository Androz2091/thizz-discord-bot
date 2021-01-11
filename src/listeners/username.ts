import chalk from 'chalk';
import { Listener } from 'discord-akairo';
import { User } from 'discord.js';

export default class StatusListener extends Listener {
    constructor () {
        super('userUpdate', {
            emitter: 'client',
            event: 'userUpdate'
        });
    }

    async exec (_oldUser: User, newUser: User) {
        const server = this.client.guilds.cache.get(process.env.THIZZ_SERVER!);
        const tgRole = server?.roles.cache.get(process.env.TG_ROLE!)!;

        const member = await server?.members.fetch(newUser.id).catch(() => {});
        if (!member) return;

        const hasTGUsername = member.user.username.startsWith('TG');
        const hasTGRole = member.roles.cache.has(tgRole.id);

        if (hasTGUsername && !hasTGRole) {
            member.roles.add(tgRole.id);
            console.log(chalk.green(`[AUTO] ${member.user.tag} has got their roles!`));
        } else if (!hasTGUsername && hasTGRole) {
            member.roles.remove(tgRole.id);
            console.log(chalk.green(`[AUTO] ${member.user.tag} has got their roles!`));
        }
    }
};
