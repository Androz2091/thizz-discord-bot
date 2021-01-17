import { SlashCreator, SlashCommand, CommandContext } from 'slash-create';
import { getUser, updateUser } from '../database/models/User';
import { Food } from '../types/food';

export default class EatCommand extends SlashCommand {
    constructor (creator: SlashCreator) {
        super(creator, {
            name: 'eat',
            description: 'Buy food to eat it later!',
            options: [
                {
                    type: 3,
                    name: 'food',
                    description: 'The type of food you want to eat!',
                    required: true
                }
            ],
            guildID: process.env.THIZZ_SERVER!
        });

        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }

    async run (ctx: CommandContext) {
        const userData = await getUser(ctx.member.id);

        const foodName = ctx.options.food;
        const foodData = userData.foods.find((food) => food.name === foodName);
        if (!foodData) {
            ctx.send(`You don't have any food named ${foodName}!`, {
                ephemeral: true,
                includeSource: false
            });
            return;
        }

        if (userData.hunger === 100) {
            ctx.send(':x: You are not hungry!', {
                includeSource: true
            });
            return;
        }

        const newFoods: Food[] = [];
        let removed = false;
        userData.foods.forEach((food) => {
            if (removed) newFoods.push(food);
            else {
                if (food.name === foodName) removed = false;
                else newFoods.push(food);
            }
        });

        updateUser(ctx.member.id, {
            hunger: userData.hunger + foodData.points,
            foods: newFoods
        });
    }
};
