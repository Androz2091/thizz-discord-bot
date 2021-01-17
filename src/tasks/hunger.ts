import type ThizzClient from '../structures/Client';
import Task from '../structures/Task';
import { getUsers, updateUser } from '../database/models/User';

export default class HungerTask extends Task {
    constructor (client: ThizzClient) {
        super(client);
        this.interval = 60000;
    }

    async run () {
        getUsers().then((users) => {
            users.forEach((user) => {
                let newHunger = user.hunger - 0.023;
                let newHealth = user.health;
                let newMoney = user.money;
                let newFoods = user.foods;
                if (newHunger < 0) {
                    newHunger = 0;
                    if (user.hunger > 0) {
                        // send warning message
                        this.client.users.fetch(user.id).then((u) => u.send(':x: Be aware! You will die if you don\'t eat in the next 3 hours!'));
                    }
                    newHealth = newHealth - 0.55;
                    if (newHealth < 0) {
                        // reset the stats
                        newHealth = 0;
                        newMoney = 0;
                        newFoods = [];
                        // send warning message
                        this.client.users.fetch(user.id).then((u) => u.send(':x: You died of hunger...'));
                    }
                }
                updateUser(user.id, {
                    health: newHealth,
                    money: newMoney,
                    foods: newFoods,
                    hunger: newHunger
                });
            });
        });
    }
};

// En 4320 minutes, le hunger d'un user doit tomber de 100% à 0%.
// Soit une baisse de 0.023% toutes les minutes.

// En 180 minutes, le health d'un user doit tomber de 100% à 0%.
// Soit une baisse de 0.55% toutes les minutes.
