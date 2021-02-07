import express from "express";
import controller from "../controllers/entry";

const router = express.Router();

router.get("/get", controller.getEntriesForMonth);
router.post("/new", controller.addEntry);

export = router;