import express from "express";
import controller from "../controllers/defaultEntry";

const router = express.Router();

router.get("/", controller.getAllEntries);
/* don't expose unallowed/unused controllers */
//router.post("/new", controller.addEntry);
//router.patch("/update/:id", controller.updateEntry);
//router.delete("/delete/:id", controller.removeEntry);

export = router;