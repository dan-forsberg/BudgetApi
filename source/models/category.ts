import mongoose, { Schema, Document } from 'mongoose';
import ICategory from '../interfaces/category';

const CategorySchema = new Schema({
    category: { type: String, required: true, trim: true }
});

export default mongoose.model<Document<ICategory>>('Category', CategorySchema);