import { Request, Response } from 'express';
import logging from '../config/logging';
import { Category } from '../models/category';
import { NoCategoryError, ParameterError } from '../interfaces/errors';
import { ValidationError } from 'sequelize';

const workspace = "category-ctrl"

const getCategories = async (req: Request, res: Response) => {
    try {
        let categories = await Category.findAll(
            { attributes: ['id', 'category'] }
        );
        res.status(200).json({ categories: categories });
    } catch (ex) {
        logging.error(workspace, "Could not fetch categories", ex.message);
        res.status(500);
    }
};

const newCategory = async (req: Request, res: Response) => {
    try {
        const reqCategory = req.body;
        if (!reqCategory || !reqCategory.category) {
            throw new NoCategoryError("No new category in body.");
        }

        const result = await Category.create(reqCategory);
        res.status(201).json({ category: result.category, id: result.id });
    } catch (err) {
        if (err instanceof NoCategoryError) {
            res.status(400).json(err.message);
        } else if (err instanceof ValidationError) {
            if (err.name === "SequelizeUniqueConstraintError") {
                res.status(400).json("Category already exists.");
            } else {
                res.status(400).json(err.message);
            }
        } else {
            res.status(500).json("Could not save category...");
            logging.error("Could not create new category.", err);
        }
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    const categoryToDeleteID = req.params.id;
    try {
        if (!categoryToDeleteID || Number.isNaN(categoryToDeleteID)) {
            throw new ParameterError("No ID specified or ID is NaN.");
        }

        const result = await Category.destroy({
            where: {
                id: categoryToDeleteID
            }
        });

        const resCode = (result > 0 ? 200 : 400);
        res.status(resCode).json({ rowsDeleted: result });

    } catch (err) {
        if (err instanceof ParameterError) {
            res.status(400).json(err.message);
        }

        res.status(500).json({ message: "Something went wrong." });
    }
};

export default { getCategories, newCategory, deleteCategory };