import mongoose from "mongoose";
import Company from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(409).json({
        message: `Company with name '${companyName}' already exists`,
      });
    }

    company = await Company.create({
      name: companyName,
      registeredBy: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ registeredBy: userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found",
      });
    }

    return res.status(200).json({
      companies,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(404).json({
        message: `Company with id ${companyId} not found`,
      });
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: `Company with id ${companyId} not found`,
      });
    }
    return res.status(200).json({
      company,
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    const companyId = req.params.id;
    
    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(404).json({
        message: `Company with id ${companyId} not found`,
      });
    }
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { name, description, website, location },
      { new: true }
    );

    if (!updateCompany) {
      return res.status(404).json({
        message: `Company with id ${companyId} not found`,
      });
    }

    return res.status(200).json({
      updatedCompany,
    });
  } catch (error) {
    console.error(error);
  }
};
