import { connect } from "../../../../../config/db.js";
import User from "../../../../../models/User/User.Model.js";
import cloudinary from "../../../../../middlewares/cloudinary.js";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connect(); // Connect to the database

    const id = params.UserID;
    const data = await request.formData();

    const userAvatar = data.get("useravatar");
    const companyAvatar = data.get("companyavatar");

    let userAvatarUrl = "";
    let userPublicId = "";
    let companyAvatarUrl = "";
    let companyPublicId = "";

    // Helper function to upload images to Cloudinary
    const uploadToCloudinary = async (file) => {
      if (!file) return null; // Return null if no file
      const buffer = Buffer.from(await file.arrayBuffer());
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) return reject(error); // Reject on error
            resolve(result); // Resolve with the upload result
          })
          .end(buffer);
      });
    };

    // Handle user avatar upload or use existing URL
    if (userAvatar) {
      const uploadResponse = await uploadToCloudinary(userAvatar);
      if (uploadResponse) {
        userAvatarUrl = uploadResponse.secure_url;
        userPublicId = uploadResponse.public_id;
      }
    }

    // Handle company avatar upload or use existing URL
    if (companyAvatar) {
      const uploadResponse = await uploadToCloudinary(companyAvatar);
      if (uploadResponse) {
        companyAvatarUrl = uploadResponse.secure_url;
        companyPublicId = uploadResponse.public_id;
      }
    }

    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      formDataObject[key] = value;
    }

    const {
      username,
      email,
      password,
      confirmpassword,
      companyname,
      role,
      isActive,
    } = formDataObject;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.confirmpassword = confirmpassword || user.confirmpassword;
    user.companyname = companyname || user.companyname;
    user.role = role || user.role;
    user.isActive = isActive || user.isActive;

    if (userAvatarUrl) {
      user.useravatar = userAvatarUrl;
      user.userPublicId = userPublicId;
    }

    if (companyAvatarUrl) {
      user.companyavatar = companyAvatarUrl;
      user.companyPublicId = companyPublicId;
    }

    await user.save();

    return NextResponse.json({
      message: "User details updated successfully",
      user,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return NextResponse.json({
      error: "Failed to update user details",
      status: 500,
    });
  }
}

// GET handler for retrieving a specific product by ID
export async function GET(request, { params }) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = params.UserID;
    console.log(id);

    // Find the product by ID
    const Find_User = await User.findById(id);

    // Check if the product exists
    if (!Find_User) {
      return NextResponse.json({ result: "No User Found", status: 404 });
    } else {
      // Return the found product as a JSON response
      return NextResponse.json({ result: Find_User, status: 200 });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    // Return an error response
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}

// Delete a blog post
export async function DELETE(request, context) {
  try {
    const id = context.params.UserID;
    console.log("User ID:", id);

    // Connect to the database
    await connect();

    // Find the blog by ID
    const user = await User.findById(id);
    console.log("User:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found", status: 404 });
    }

    const userPublicId = user.userPublicId; // Ensure this matches your schema
    console.log("Image Public ID:", userPublicId);
    const companyImageId = user.companyPublicId; // Ensure this matches your schema
    console.log("Image Public ID:", companyImageId);

    // Delete the blog from the database
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({
        message: "Failed to delete blog",
        status: 500,
      });
    }

    // Delete the image from Cloudinary if publicId exists
    if (userPublicId && companyImageId) {
      try {
        const cloudinaryResponse1 = await cloudinary.v2.uploader.destroy(
          userPublicId
        );
        const cloudinaryResponse2 = await cloudinary.v2.uploader.destroy(
          companyImageId
        );
        console.log(`Cloudinary response: ${cloudinaryResponse1.result}`);
        console.log(`Cloudinary response: ${cloudinaryResponse2.result}`);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    return NextResponse.json({
      message: "Blog and associated image deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog", status: 500 });
  }
}
