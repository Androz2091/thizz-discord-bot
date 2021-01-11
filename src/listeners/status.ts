import chalk from 'chalk';
import { Listener } from 'discord-akairo';
import { Presence } from 'discord.js';

export default class StatusListener extends Listener {
    constructor () {
        super('presenceUpdate', {
            emitter: 'client',
            event: 'presenceUpdate'
        });
    }

    async exec (_oldPresence: Presence, newPresence: Presence) {
        const server = this.client.guilds.cache.get(process.env.THIZZ_SERVER!);
        const marketerRole = server?.roles.cache.get(process.env.MARKETER_ROLE!)!;

        const member = await server?.members.fetch(newPresence.userID).catch(() => {});
        if (!member) return;

        const hasMarketerPresence = member.user.presence.activities[0]?.state?.includes('.gg/thizz');
        const hasMarketerRole = member.roles.cache.has(marketerRole.id);

        if (hasMarketerPresence && !hasMarketerRole) {
            member.roles.add(marketerRole.id);
            console.log(chalk.green(`[AUTO] ${member.user.tag} has got their roles!`));
        } else if (!hasMarketerPresence && hasMarketerRole) {
            member.roles.remove(marketerRole.id);
            console.log(chalk.green(`[AUTO] ${member.user.tag} has got their roles!`));
        }
    }
};
