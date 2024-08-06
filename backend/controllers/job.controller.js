import Job from "../models/job.model.js";
import mongoose from "mongoose";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      openings,
      company,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !openings ||
      !company
    ) {
      return res.status(422).json({
        message: "All fields not filled",
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(", "),
      salary: Number(salary),
      experienceInYrs: Number(experience),
      jobType,
      location,
      openings,
      company,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const jobs = await Job.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .populate({ path: "company", select: "name -_id" })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
      });
    }

    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(404).json({
        message: `Job ID: ${jobId} is not a valid ID`,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: `Job with id ${jobId} not found`,
      });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error(error);
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const userId = req.id;
    const jobs = await Job.find({ createdBy: userId });

    if (!jobs) {
      return res.status(400).json({
        message: "No job found for this user",
      });
    }

    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
  }
};
