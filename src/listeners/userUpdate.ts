import { User } from "discord.js";
import { Listener } from "discord-akairo";

export default class UserUpdateListener extends Listener {
    constructor() {
        super('userUpdate', {
            emitter: 'client',
            event: 'userUpdate'
        });
    }

    async exec (oldUser: User, newUser: User) {

        console.log(newUser)
        console.log(`User update ${newUser.username}`);
        
        const server = this.client.guilds.cache.get(process.env.TG_SERVER!);
        const member = await server?.members.fetch(newUser.id).catch(() => {});
        if (!member) return;
        const role = server?.roles.cache.get(process.env.TG_ROLE!)!;

        if (newUser.username.startsWith('TG')) {
            member.roles.add(role);
        } else {
            member.roles.remove(role);
        }

    }
};
