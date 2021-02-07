import express from "express";
import controller from "../controllers/entry";

const router = express.Router();

router.get("/", controller.getAllEntries);
router.get("/specific", controller.getSpecific);
router.post("/new", controller.addEntry);
router.patch("/update/:id", controller.updateEntry);
router.delete("/delete/:id", controller.removeEntry);

export = router;