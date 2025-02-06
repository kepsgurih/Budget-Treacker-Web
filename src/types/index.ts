export interface BudgetItem {
    id: number;
    description: string;
    amount: number;
    catId: number;
    type: boolean;
    date: Date;
}


export interface CategoryItem {
    id: number;
    name: string;
    maxAmount: number;
}