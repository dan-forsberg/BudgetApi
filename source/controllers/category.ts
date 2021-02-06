import { Request, Response } from 'express';
import logging from '../config/logging';
import { Category } from '../models/category';
import { NoCategoryError } from '../interfaces/errors';

const workspace = "category-ctrl"

const getCategories = async (req: Request, res: Response) => {
    try {
        //let categories = await Category.find();
        let categories = null;
        res.status(200).json({ categories: categories });
    } catch (ex) {
        logging.error(workspace, "Could not fetch categories", ex.message);
        res.status(500);
    }
};

const newCategory = async (req: Request, res: Response) => {
    try {
        const reqCategory = req.body.category;
        console.log(reqCategory);
        if (!reqCategory) {
            throw new NoCategoryError("No new category in body.");
        }

        //const newCategory = new Category({ category: reqCategory });
        //const result = await newCategory.save();

        //console.log(result);

        res.status(201);//.json(result);
    } catch (err) {
        if (err instanceof NoCategoryError) {
            res.status(400).json(err.message);
        } else {
            logging.error("Could not create new category.", err.message);
            res.status(500);
        }
    }
};

export default { getCategories, newCategory };