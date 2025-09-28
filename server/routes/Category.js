import express from "express";
import { getCategory } from "../controller/Category.js";

const router = express.Router();

router.get("/", getCategory);

export default router;
