import { connect } from "../../../../config/db.js";
import User from "../../../../models/User/User.Model.js";
import cloudinary from "../../../../middlewares/cloudinary.js";
import { catchAsyncErrors } from "../../../../middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connect();
    const data = await request.formData();

    // Handling the uploaded files
    let file1 = data.get("useravatar");
    console.log("User Avatar:", file1);

    let file2 = data.get("companyavatar");
    if (!file1) {
      console.log(
        "Company Avatar not provided, using User Avatar as fallback."
      );
      file1 = file2; // Use file1 as fallback if file2 is not provided
    } else {
      console.log("Company Avatar:", file2);
      file2 = file1;
    }

    let useravatar = "";
    let useravatarId = "";
    let companyavatarImage = "";
    let companyavatarId = "";

    // Upload files to Cloudinary
    if (file1) {
      const buffer1 = Buffer.from(await file1.arrayBuffer());
      const uploadResponse1 = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(
                  new Error("Error uploading displayImage: " + error.message)
                );
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer1);
      });

      useravatar = uploadResponse1.secure_url; // Cloudinary URL for display image
      useravatarId = uploadResponse1.public_id;
    }

    if (file2) {
      const buffer2 = Buffer.from(await file2.arrayBuffer());
      const uploadResponse2 = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(
                  new Error("Error uploading authorImage: " + error.message)
                );
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer2);
      });

      companyavatarImage = uploadResponse2.secure_url; // Cloudinary URL for author image
      companyavatarId = uploadResponse2.public_id;
    }

    // Constructing formDataObject excluding the files
    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      if (key !== "useravatar" && key !== "companyavatar") {
        formDataObject[key] = value;
      }
    }

    const {
      username,
      email,
      password,
      companyname,
      confirmpassword,
      isActive,
      role,
    } = formDataObject;
    if (password !== confirmpassword) {
      return NextResponse.json({
        error: "Passwords do not match",
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        error: "User with this email already exists",
        status: 400,
      });
    }

    // Create and save the new blog entry
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      companyname,
      confirmpassword,
      useravatar: useravatar, // Use the uploaded or dummy image
      userPublicId: useravatarId,
      companyavatar: companyavatarImage, // Use the uploaded or dummy image
      companyPublicId: companyavatarId,
      isActive: isActive || false,
      role: role || "user", // Default to "user" if no role is specified
    });

    console.log(newUser);

    // return;

    const savedUser = await newUser.save();
    if (!savedUser) {
      return NextResponse.json({ message: "User not added", status: 400 });
    } else {
      return NextResponse.json({
        message: "User created successfully",
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allUsers = await User.find();
  const userCount = await User.countDocuments();
  return NextResponse.json({ result: allUsers, count: userCount });
});
