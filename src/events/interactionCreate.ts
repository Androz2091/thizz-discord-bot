import Event from '../structures/Event';
import ThizzClient from '../structures/Client';

export default class ReadyListener extends Event {
    constructor (client: ThizzClient, name: string) {
        super(client, name);
    }

    async run () {
        console.log('Interaction Create!');
    }
};
