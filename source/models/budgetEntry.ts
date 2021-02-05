import mongoose, { Schema, Document } from 'mongoose';
import IBudgetEntry from '../interfaces/budgetEntry';

const BudgetEntrySchema = new Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: { type: mongoose.Types.ObjectId, required: true }
});

export default mongoose.model<Document<IBudgetEntry>>('Entry', BudgetEntrySchema);