import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      res.status(400).json({
        message: "All fields are not filled",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({
        message: "All fields are not filled",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: `${email} is not registered`,
      });
    }

    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (!isPasswordSame) {
      res.status(400).json({
        message: "Wrong password",
      });
    }

    if (role != user.role) {
      res.status(400).json({
        mesage: `Account registered as ${user.role}, kindly login with that role`,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const responseUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Successfully logged in!",
        responseUser,
      });
  } catch (error) {
    console.error(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        phoneNumber,
        profile: {
          bio,
          skills: skillsArray,
        },
      },
      { returnOriginal: false }
    );

    res.status(200).json({
      message: "Updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
  }
};
