import chalk from 'chalk';
import { GuildMember, Snowflake } from 'discord.js';
import type ThizzClient from '../structures/Client';
import Task from '../structures/Task';

interface WaitingRole {
    value: Snowflake;
    time: number;
}

type RoleChangeType = 'add' | 'remove';

export default class AutoroleTask extends Task {
    public lastFetchedAt?: number = undefined;
    public waitingForRoles: WaitingRole[] = [];

    constructor (client: ThizzClient) {
        super(client);

        setInterval(() => {
            const time = Date.now();
            this.waitingForRoles = this.waitingForRoles.filter((item) => {
                return time < item.time + (30000);
            });
        }, 500);
    }

    async changeRole (member: GuildMember, roleID: Snowflake, type: RoleChangeType) {
        if (this.waitingForRoles.some((element) => element.value === member.id)) {
            console.log(chalk.yellow(`${member.user.tag} is still waiting for their roles...`));
        }
        this.waitingForRoles.push({
            value: member.id,
            time: Date.now()
        });
        (type === 'add' ? member.roles.add : member.roles.remove)(roleID).then(() => {
            console.log(chalk.yellow(`${member.user.tag} has got their roles!`));
            this.waitingForRoles = this.waitingForRoles.filter((element) => element.value !== member.id);
        });
    }

    async run () {
        const server = this.client.guilds.cache.get(process.env.THIZZ_SERVER!);
        const tgRole = server?.roles.cache.get(process.env.TG_ROLE!)!;
        const marketerRole = server?.roles.cache.get(process.env.MARKETER_ROLE!)!;

        if (!this.lastFetchedAt || (this.lastFetchedAt + (60000*10) < Date.now())) {
            await server?.members.fetch();
        }

        server?.members.cache.forEach((member) => {
            const hasTGUsername = member.user.username.startsWith('TG');
            const hasTGRole = member.roles.cache.has(tgRole.id);

            if (hasTGUsername && !hasTGRole) {
                this.changeRole(member, tgRole.id, 'add');
            } else if (!hasTGUsername && hasTGRole) {
                this.changeRole(member, tgRole.id, 'remove');
            }

            const hasMarketerPresence = member.user.presence.activities[0]?.state?.includes('.gg/thizz');
            const hasMarketerRole = member.roles.cache.has(marketerRole.id);

            if (hasMarketerPresence && !hasMarketerRole) {
                this.changeRole(member, marketerRole.id, 'add');
            } else if (!hasMarketerPresence && hasMarketerRole) {
                this.changeRole(member, marketerRole.id, 'remove');
            }
        });
    }
};
