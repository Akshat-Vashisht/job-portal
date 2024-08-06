import express from "express";
import {
  getJobById,
  getAllJobs,
  postJob,
  getAdminJobs,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").post(isAuthenticated, postJob);
router.route("/").get(isAuthenticated, getAllJobs);
router.route("/admin").get(isAuthenticated, getAdminJobs);
router.route("/:id").get(isAuthenticated, getJobById);

export default router;
