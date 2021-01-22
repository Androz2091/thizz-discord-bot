import path from 'path';
import { AkairoClient, ListenerHandler } from 'discord-akairo';
import TempChannels from 'discord-temp-channels';
import type { GuildMember, TextChannel, VoiceChannel } from 'discord.js';
import { Collection } from 'discord.js';
import TaskHandler from '../handlers/task';
import { SlashCreator, GatewayServer } from 'slash-create';

export default class ThizzClient extends AkairoClient {
    public slashCommandHandler: SlashCreator;
    public listenerHandler: ListenerHandler;
    public tempChannelsHandler: TempChannels;
    public taskHandler: TaskHandler;

    public typingChannels: Collection<string, TextChannel>;

    constructor () {
        super({
            partials: ['CHANNEL'],
            ownerID: process.env.BOT_OWNER!
        });

        this.typingChannels = new Collection();

        this.slashCommandHandler = new SlashCreator({
            applicationID: process.env.BOT_ID!,
            token: process.env.BOT_TOKEN!,
            publicKey: process.env.BOT_PUB_KEY!
        });
        this.slashCommandHandler
            .withServer(
                new GatewayServer(
                    (handler) => {
                        this.on('raw', (event) => {
                            if (event.t === 'INTERACTION_CREATE') handler(event.d);
                        });
                    }
                )
            )
            .registerCommandsIn(path.join(__dirname, '..', 'commands/'))
            .syncCommands();

        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, '..', 'listeners/')
        });

        this.taskHandler = new TaskHandler(this);
        this.once('ready', () => this.taskHandler.load());

        this.tempChannelsHandler = new TempChannels(this);
        this.tempChannelsHandler.registerChannel(process.env.TEMP_CHANNELS_CHANNEL!, {
            childCategory: process.env.TEMP_CHANNELS_CATEGORY!,
            childAutoDelete: true,
            childAutoDeleteIfOwnerLeaves: true,
            childMaxUsers: 5,
            childFormat: (member, count) => `${member.user.username}'s channel`
        });
        this.tempChannelsHandler.on('childCreate', (member: GuildMember, channel: VoiceChannel) => {
            channel.overwritePermissions([
                {
                    id: member.user.id,
                    allow: ['MANAGE_CHANNELS']
                }
            ]);
        });
    }

    async start () {
        this.listenerHandler.loadAll();
        return super.login(process.env.BOT_TOKEN);
    }
};
