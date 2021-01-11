import ThizzClient from './Client';

interface CommandOptions {

};

export default class Command {
    public client: ThizzClient;
    public name: string;

    constructor (client: ThizzClient, name: string, options: CommandOptions) {
        this.client = client;
        this.name = name;
    }

    async create () {
        throw new Error(`Cannot create an empty command: ${this.name}`);
    }

    async run () { }
}
