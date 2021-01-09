import { readdirSync } from 'fs';
import { Collection } from "discord.js";
import { Task } from "../structures/Task";

export default class TaskHandler {

    public tasks: Collection<string, Task>;
    public tasksIntervals: Collection<string, number>; 

    constructor () {
        this.tasks = new Collection();
        this.tasksIntervals = new Collection();
    }

    load () {
        const files = readdirSync('./tasks')
        files.forEach((file) => {
            const task = require(`../tasks/${file}`);
            this.tasks.set(task.name, task);
        });

        this.tasks.forEach((task) => {
            this.tasksIntervals.set(task.name, setInterval(() => task.protectRun(), task.interval));
        })
    }

};
