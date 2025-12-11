import Captain from "../models/Users.models.js";

export const createCaptain = async ({
  fullname,
  email,
  password,
  role = "captain",
  vehicle,
}) => {
  if (
    !fullname.firstname ||
    !email ||
    !password ||
    !role ||
    !vehicle.color ||
    !vehicle.plate ||
    !vehicle.capacity ||
    !vehicle.vehicleType
  ) {
    throw new Error("All fields are required");
  } else {
    const hashedPassword = await Captain.hashPassword(password);
    const captain = await Captain.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      captainStatus: "available",
      vehicle: {
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
      },
    });
    return captain;
  }
};
