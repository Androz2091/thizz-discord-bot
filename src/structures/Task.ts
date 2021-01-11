import ThizzClient from "./Client";

export default class Task {

    public interval?: number = 1000;
    public client: ThizzClient;
    public lastRunCompleted?: boolean = true;

    constructor (client: ThizzClient) {
        this.client = client;
    }

    protectRun () {
        if (!this.lastRunCompleted) return;
        else {
            this.lastRunCompleted = false;
            this.run().then(() => {
                this.lastRunCompleted = true;
            })
        }
    }

    async run () {}

};
