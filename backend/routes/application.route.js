import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyForJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyForJob);
router.route("/").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id").patch(isAuthenticated, updateStatus);

export default router;
