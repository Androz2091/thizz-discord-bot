import { Client, GuildMember, VoiceChannel } from 'discord.js';

import Interactions from 'discord-slash-commands-client';
import TempChannelsHandler from 'discord-temp-channels';
import TaskHandler from '../handlers/task';
import EventHandler from '../handlers/event';
import CommandHandler from '../handlers/command';

export default class ThizzClient extends Client {
    public commandHandler: CommandHandler;
    public eventHandler: EventHandler;
    public tempChannelsHandler: TempChannelsHandler;
    public taskHandler: TaskHandler;
    public interactionsHandler: Interactions.Client;

    constructor () {
        super();

        this.commandHandler = new CommandHandler(this).load();
        this.tempChannelsHandler = new TempChannelsHandler(this);
        this.eventHandler = new EventHandler(this).load();
        this.taskHandler = new TaskHandler(this);
        this.interactionsHandler = new Interactions.Client(process.env.BOT_TOKEN!, process.env.BOT_ID!);

        this.once('ready', () => this.taskHandler.load());
        this.tempChannelsHandler.registerChannel(process.env.TEMP_CHANNELS_CHANNEL!, {
            childCategory: process.env.TEMP_CHANNELS_CATEGORY!,
            childAutoDelete: true,
            childAutoDeleteIfOwnerLeaves: true,
            childMaxUsers: 5,
            childFormat: (member) => `${member.user.username}'s channel`
        });
        this.tempChannelsHandler.on('childCreate', (member: GuildMember, channel: VoiceChannel) => {
            channel.overwritePermissions([{
                id: member.user.id,
                allow: ['MANAGE_CHANNELS']
            }]);
        });
    }

    async start () {
        return super.login(process.env.BOT_TOKEN);
    }
};
