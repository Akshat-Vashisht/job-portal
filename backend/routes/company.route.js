import express from "express";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").post(isAuthenticated, registerCompany);
router.route("/:id").patch(isAuthenticated, updateCompany);
router.route("/").get(isAuthenticated, getCompany);
router.route("/:id").get(isAuthenticated, getCompanyById);

export default router;
