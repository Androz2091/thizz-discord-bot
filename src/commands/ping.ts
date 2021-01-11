import ThizzClient from '../structures/Client';
import Command from '../structures/Command';

class PingCommand extends Command {
    constructor (client: ThizzClient) {
        super(client, 'ping', {});
    }

    async exec () {
    }
}

export default PingCommand;
