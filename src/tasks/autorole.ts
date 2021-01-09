import type ThizzClient from "../core/client"

export default class AutoroleTask {

    public interval = 1000;
    public lastFetchedAt?: number = undefined;
    public client: ThizzClient;

    constructor (client: ThizzClient) {
        this.client = client;
    }

    async run () {

        const server = this.client.guilds.cache.get(process.env.THIZZ_SERVER!);
        const tgRole = server?.roles.cache.get(process.env.TG_ROLE!)!;
        const marketerRole = server?.roles.cache.get(process.env.MARKETER_ROLE!)!;

        if (!this.lastFetchedAt || (this.lastFetchedAt + (60000*10) < Date.now())) {
            await server?.members.fetch();
        }

        server?.members.cache.forEach((member) => {
            if (member.user.username.startsWith('TG')) member.roles.add(tgRole);
            else member.roles.remove(tgRole);

            console.log(member.user.presence.activities[0]?.state, member.user.presence.activities[0] && member.user.presence.activities[0].state?.includes('discord.gg/thizz'))
            if (member.user.presence.activities[0] && member.user.presence.activities[0].state?.includes('discord.gg/thizz')) member.roles.add(marketerRole);
            else member.roles.remove(marketerRole); 
        });

    }

};
