import express from "express";
import { body } from "express-validator";
import {
  getProfileController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/captain.controller.js";
import { isAuthenticated } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    // vehicle color
    body("vehicle.color")
      .if(body("role").equals("captain"))
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters"),
    // vehicle plate no.
    body("vehicle.plate")
      .if(body("role").equals("captain"))
      .isLength({ min: 6 })
      .withMessage("Plate must be at least 6 characters"),
    // vehicle capacity
    body("vehicle.capacity")
      .if(body("role").equals("captain"))
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    // vehicle types
    body("vehicle.vehicleType")
      .if(body("role").equals("captain"))
      .isIn(["motorcycle", "car", "auto"])
      .withMessage("Invalid vehicle type"),
  ],
  registerController
);
router.post("/login", loginController);
router.get("/me", isAuthenticated, getProfileController);
router.get("/logout", isAuthenticated, logoutController);

export default router;
