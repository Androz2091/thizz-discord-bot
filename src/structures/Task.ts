import ThizzClient from "./Client";

export class Task {

    public name: string;
    public interval?: number = 1000;
    public client: ThizzClient;
    public lastRunCompleted?: boolean;

    constructor (client: ThizzClient, name: string) {
        this.name = name;
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
