import { validationResult } from "express-validator";
import Blacklist from "../models/Blacklist.model.js";
import { createCaptain } from "../services/captain.service.js";
import Captain from "../models/Users.models.js";
import { createUser } from "../services/user.service.js";

export const registerController = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, role, vehicle } = req.body;
  console.log(req.body);

  const isCaptainExists = await Captain.findOne({ email: email });
  if (isCaptainExists) {
    if (isCaptainExists?.role === "user" && req.body?.vehicle) {
      return res.status(400).json({
        message:
          "User account exists, Please login for create a captain account",
        navigate: "/login",
      });
    } else if (isCaptainExists?.role === "user" && !req.body?.vehicle) {
      return res.status(400).json({
        message: "User already exists",
        navigate: "/login",
      });
    } else {
      return res.status(400).json({
        message: "Captain already exists",
        navigate: "/captain-login",
      });
    }
  }

  try {
    if (req.body?.role === "captain") {
      const captain = await createCaptain({
        fullname,
        email,
        password,
        role,
        vehicle,
      });

      const token = captain.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 86400 * 7,
      });
      return res.status(201).json({
        fullname,
        email,
        role,
        vehicle,
        captainStatus: captain?.captainStatus,
      });
    } else if (req.body?.role === "user") {
      const user = await createUser({ fullname, email, password, role });

      const token = user.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 86400 * 7,
      });
      return res.status(201).json({
        fullname,
        email,
        role,
      });
    }
  } catch (error) {
    // MongoDB UNIQUE items error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: `Server Error : ${error.message}`,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password, role } = req.body;

  const captain = await Captain.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (captain.role !== role) {
    return res
      .status(401)
      .json({ message: "Invalid email or password -> role mismatched" });
  }
  const isPasswordMatched = await captain.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid email or password" });
  } else {
    const token = captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 86400 * 7,
    });

    return res.status(200).json({
      fullname: captain.fullname,
      email: captain.email,
      role: captain.role,
    });
  }
};

export const getProfileController = async (req, res) => {
  return res.status(200).json({ message: "welcome!", ...req.user });
};

export const logoutController = async (req, res) => {
  res.clearCookie("token");
  const token =
    req.cookies.token || req.headers.authorization.replace("Bearer ", "");
  await Blacklist.create({ token: token });
  res.status(200).json({ message: "Logout done" });
};
