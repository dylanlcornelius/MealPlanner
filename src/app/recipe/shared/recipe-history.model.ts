import { Model } from '@model';

export class RecipeHistory extends Model {
    uid: string;
    recipeId: string
    history: Array<string>;
    timesCooked: number;
    lastDateCooked: string;

    constructor(data: any = {}) {
        super();
        this.id = data.id || '';
        this.uid = data.uid;
        this.recipeId = data.recipeId;
        this.history = data.history || [];
        this.timesCooked = data.timesCooked || 0;
        this.lastDateCooked = data.lastDateCooked || '';
    }

    public getObject() {
        const {id, ...recipeHistory} = this;
        return recipeHistory;
    }
}
