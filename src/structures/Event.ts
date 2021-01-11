import ThizzClient from './Client';

export default class Event {
    public client: ThizzClient;
    public name: string;

    constructor (client: ThizzClient, name: string) {
        this.client = client;
        this.name = name;
    }

    register () {
        this.client.on(this.name, () => this.run());
    }

    async run () {}
};
