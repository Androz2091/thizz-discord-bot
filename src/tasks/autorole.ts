import type ThizzClient from "../structures/Client"
import { Task } from "../structures/Task";

export default class AutoroleTask extends Task {

    public lastFetchedAt?: number = undefined;

    constructor (client: ThizzClient) {
        super(client, 'autorole');
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
                member.roles.add(tgRole.id);
            } else if (!hasTGUsername && hasTGRole) {
                member.roles.remove(tgRole.id);
            }

            const hasMarketerPresence = member.user.presence.activities[0]?.state?.includes('discord.gg/thizz');
            const hasMarketerRole = member.roles.cache.has(marketerRole.id);

            if (hasMarketerPresence && !hasMarketerRole) {
                member.roles.add(marketerRole.id);
            } else if (!hasMarketerPresence && hasMarketerRole) {
                member.roles.remove(marketerRole.id);
            }
        });

    }

};