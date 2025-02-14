import { connect } from "@config/db.js";
import User from "@models/User/User.Model.js";
import cloudinary from "@middlewares/cloudinary.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.UserID;
    const data = await request.formData();

    const userAvatar = data.get("useravatar");

    let userAvatarUrl = "";
    let userPublicId = "";

    // Check if the user avatar is an object and has a valid name (indicating it's a file)
    if (typeof userAvatar === "object" && userAvatar.name) {
      const byteData = await userAvatar.arrayBuffer();
      const buffer = Buffer.from(byteData);

      // Upload the new image to Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Write buffer to the upload stream
        uploadStream.end(buffer);
      });

      userAvatarUrl = uploadResponse.secure_url;
      userPublicId = uploadResponse.public_id;
    }

    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      formDataObject[key] = value;
    }

    const {
      title,
      firstName,
      lastName,
      email,
      tel1,
      tel2,
      postcode,
      postalAddress,
      permanentAddress,
      city,
      county,
      accessLevel,
      dateOfBirth,
      position,
      reportsTo,
      username,
      password,
      passwordExpires,
      passwordExpiresEvery,
      confirmpassword,
      companyname,
      CreatedBy,
      isActive,
      role,
      userId,
      companyId,
      Postcode,
    BuildingAndStreetOne,
    BuildingAndStreetTwo,
    Town_City,
    Country,
    } = formDataObject;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }


    // Update user fields if provided
    if (password) {
      // Hash the new password before updating
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    } else {
      // Keep the existing password if no new password is provided
      user.password = user.password;
    }
  
    user.userId = userId || user.userId;
    user.companyId = companyId || user.companyId;
    user.Postcode = Postcode || user.Postcode;
    user.BuildingAndStreetOne = BuildingAndStreetOne || user.BuildingAndStreetOne;
    user.BuildingAndStreetTwo = BuildingAndStreetTwo || user.BuildingAndStreetTwo;
    user.Town_City = Town_City || user.Town_City;
    user.Country = Country || user.Country;
    user.title = title || user.title;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.tel1 = tel1 || user.tel1;
    user.tel2 = tel2 || user.tel2;
    user.postcode = postcode || user.postcode;
    user.postalAddress = postalAddress || user.postalAddress;
    user.permanentAddress = permanentAddress || user.permanentAddress;
    user.city = city || user.city;
    user.county = county || user.county;
    user.accessLevel = accessLevel || user.accessLevel;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.position = position || user.position;
    user.reportsTo = reportsTo || user.reportsTo;
    user.username = username || user.username;

    user.confirmpassword = confirmpassword || user.confirmpassword;
    user.passwordExpires = passwordExpires || user.passwordExpires;
    user.passwordExpiresEvery =
      passwordExpiresEvery || user.passwordExpiresEvery;
    user.companyname = companyname || user.companyname;
    user.CreatedBy = CreatedBy || user.CreatedBy;
    user.isActive = isActive || user.isActive;
    user.role = role || user.role;

    // Handle avatar update: remove old avatar from Cloudinary and update with new one if uploaded
    if (userAvatarUrl && userPublicId) {
      if (user.userPublicId) {
        try {
          // Delete old avatar from Cloudinary if it exists
          await cloudinary.uploader.destroy(user.userPublicId);
          console.log("Old avatar deleted from Cloudinary.");
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Update user with new avatar details
      user.useravatar = userAvatarUrl;
      user.userPublicId = userPublicId;
      console.log("New avatar uploaded and updated.");
    }

    // Save updated user details
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
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.UserID;
    // console.log(id);

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

    const userPublicIdd = user.userPublicId; // Ensure this matches your schema
    console.log("Image Public ID:", userPublicIdd);
    const companyPublicIdd = user.companyPublicId; // Ensure this matches your schema
    console.log("Image Public ID:", companyPublicIdd);

    // Delete the blog from the database
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({
        message: "Failed to delete blog",
        status: 500,
      });
    }

    // Delete the image from Cloudinary if publicId exists
    if (userPublicIdd && companyPublicIdd) {
      try {
        const cloudinaryResponse1 = await cloudinary.uploader.destroy(
          userPublicIdd
        );
        const cloudinaryResponse2 = await cloudinary.uploader.destroy(
          companyPublicIdd
        );
        console.log(`Cloudinary response: ${cloudinaryResponse1.result}`);
        console.log(`Cloudinary response: ${cloudinaryResponse2.result}`);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    return NextResponse.json({
      message: "User and associated image deleted successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting User:", error);
    return NextResponse.json({ error: "Failed to delete User", status: 500 });
  }
}
