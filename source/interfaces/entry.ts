export default interface IEntry {
    _id?: any;
    date: Date;
    description: String;
    amount: number;
    /* reference to category table, type should be changed */
    category: any;
};