import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import Event from '../structures/Event';
import ThizzClient from '../structures/Client';

export default class EventHandler {
    public client: ThizzClient;
    public events: Collection<string, Event>;

    constructor (client: ThizzClient) {
        this.client = client;
        this.events = new Collection();
    }

    load () {
        const files = readdirSync(`${__dirname}/../events`);
        files.forEach((file) => {
            const CustomEvent = require(`../events/${file}`);
            const [eventName] = file.split('.');
            // eslint-disable-next-line new-cap
            const event = new CustomEvent.default(this.client);
            event.register();
            this.events.set(eventName, event);
        });
        return this;
    }
};
