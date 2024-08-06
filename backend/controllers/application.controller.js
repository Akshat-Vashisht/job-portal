import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(422).json({
        message: "Job Id is missing",
      });
    }

    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({
        message: "This job doesn't exist",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    existingJob.applications.push(application._id);
    await existingJob.save();

    return res.status(201).json({
      message: "Application created successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "No application found",
      });
    }

    return res.status(200).json({ application });
  } catch (error) {
    console.error(error);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { created_at: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      job,
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const status = req.body.status;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(422).json({
        message: "Status is missing",
      });
    }

    const application = await Application.findOne({ _id: applicationId });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);
  }
};
