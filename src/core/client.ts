import path from 'path';
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import TempChannels from 'discord-temp-channels';
import type { GuildMember, VoiceChannel } from 'discord.js';
import AutoroleTask from '../tasks/autorole';

export default class ThizzClient extends AkairoClient {

    public commandHandler: CommandHandler;
    public listenerHandler: ListenerHandler;
    public tempChannelsHandler: TempChannels;

    public autoroleTask: AutoroleTask;
    public autoroleTaskCompleted: boolean;

    constructor() {
        super({
            ownerID: process.env.BOT_OWNER!
        });

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, '..', 'commands/'),
            prefix: () => process.env.BOT_PREFIX!
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, '..', 'listeners/')
        });

        this.tempChannelsHandler = new TempChannels(this);
        this.tempChannelsHandler.registerChannel(process.env.TEMP_CHANNELS_CHANNEL!, {
            childCategory: process.env.TEMP_CHANNELS_CATEGORY!,
            childAutoDelete: true,
            childAutoDeleteIfOwnerLeaves: true,
            childMaxUsers: 5,
            childFormat: (member, count) => `${member.user.username}'s channel`
        });
        this.tempChannelsHandler.on("childCreate", (member: GuildMember, channel: VoiceChannel) => {
            channel.overwritePermissions([
                {
                    id: member.user.id,
                    allow: [ 'MANAGE_CHANNELS' ]
                }
            ]);
        });

        this.autoroleTask = new AutoroleTask(this);
        this.autoroleTaskCompleted = true;
        setInterval(() => {
            if (!this.autoroleTaskCompleted) return;
            else {
                this.autoroleTaskCompleted = false;
                this.autoroleTask.run().then(() => this.autoroleTaskCompleted = true);
            }
        }, this.autoroleTask.interval);
        
    }

    async start () {
        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        return super.login(process.env.BOT_TOKEN);
    }
};
