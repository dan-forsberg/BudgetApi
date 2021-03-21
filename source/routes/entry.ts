import express from "express";
import controller from "../controllers/entry";

const router = express.Router();


router.get("/specific", controller.getSpecific);
router.post("/new", controller.addEntry);
router.patch("/update/:id", controller.updateEntry);
/* Don't expose unused/unallowed controllers */
//router.get("/", controller.getAllEntries);
//router.delete("/delete/:id", controller.removeEntry);

export = router;