import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import Task from '../structures/Task';
import ThizzClient from '../structures/Client';
import chalk from 'chalk';

export default class TaskHandler {
    public client: ThizzClient;
    public tasks: Collection<string, Task>;
    public tasksIntervals: Collection<string, ReturnType<typeof setTimeout>>;

    constructor (client: ThizzClient) {
        this.client = client;
        this.tasks = new Collection();
        this.tasksIntervals = new Collection();
    }

    load () {
        const files = readdirSync(`${__dirname}/../tasks`);
        files.forEach((file) => {
            const CustomTask = require(`../tasks/${file}`);
            const [taskName] = file.split('.');
            // eslint-disable-next-line new-cap
            const task = new CustomTask.default(this.client);
            this.tasks.set(taskName, task);
            task.protectRun();
            console.log(chalk.green(`Task ${taskName} started and will run every ${task.interval} ms!`));
            this.tasksIntervals.set(taskName, setInterval(() => task.protectRun(), task.interval));
        });
        return this;
    }
};
