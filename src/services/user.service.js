import userModel from "../models/user.models.js";

export const createUser = async ({ fullname, email, password }) => {
  if (!fullname.firstname || !email || !password) {
    throw new Error("All fields are required");
  } else {
    const user = await userModel.create({
      fullname,
      email,
      password,
    });
    return user;
  }
};
