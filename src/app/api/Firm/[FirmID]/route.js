import { connect } from "@config/db.js";
import { Firm } from "@models/Firm/Firm.Model";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export const PUT = async (request, context) => {
  try {
    await connect();
    const id = context.params.FirmID; // Access FirmID from context.params
    const data = await request.formData();
    console.log(id);
    console.log(data);

    // Get existing Firm by ID
    const existingFirm = await Firm.findOne({ _id: id });
    if (!existingFirm) {
      return NextResponse.json({
        error: "Firm not found",
        status: 404,
      });
    }

    // Handle image file upload if present
    let file1 = data.get("imageFile");
    let imageFile = existingFirm.imageFile;
    let imagepublicId = existingFirm.imagepublicId;

    if (file1 && typeof file1 === "object" && file1.name) {
      console.log(file1.name);
      const buffer = Buffer.from(await file1.arrayBuffer());

      // Delete the old image from Cloudinary if a new image is uploaded
      if (imagepublicId) {
        try {
          await cloudinary.uploader.destroy(imagepublicId);
          console.log("Old avatar deleted from Cloudinary.");
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Upload new image to Cloudinary
      const uploadResponse1 = await new Promise((resolve, reject) => {
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

      imageFile = uploadResponse1.secure_url;
      imagepublicId = uploadResponse1.public_id;
    }

    // Constructing the updated data
    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      if (key !== "imageFile") {
        formDataObject[key] = value;
      }
    }

    const {
      name,
      description,
      imageName,
      companyNo,
      vatNo,
      insurancePolicyNo,
      website,
      email,
      tel1,
      tel2,
      address,
      city,
      country,
      postcode,
      employmentLetter,
      coverLetter,
      signature,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      // imageNote,
    } = formDataObject;

    // Update the existing Firm
    // existingFirm.imageNote = imageNote || existingFirm.imageNote;
    existingFirm.name = name || existingFirm.name;
    existingFirm.description = description || existingFirm.description;
    existingFirm.imageName = imageName || existingFirm.imageName;
    existingFirm.imagepublicId = imagepublicId || existingFirm.imagepublicId;
    existingFirm.imageFile = imageFile || existingFirm.imageFile;
    existingFirm.companyNo = companyNo || existingFirm.companyNo;
    existingFirm.vatNo = vatNo || existingFirm.vatNo;
    existingFirm.insurancePolicyNo =
      insurancePolicyNo || existingFirm.insurancePolicyNo;
    existingFirm.website = website || existingFirm.website;
    existingFirm.email = email || existingFirm.email;
    existingFirm.tel1 = tel1 || existingFirm.tel1;
    existingFirm.tel2 = tel2 || existingFirm.tel2;
    existingFirm.address = address || existingFirm.address;
    existingFirm.city = city || existingFirm.city;
    existingFirm.country = country || existingFirm.country;
    existingFirm.postcode = postcode || existingFirm.postcode;
    existingFirm.employmentLetter =
      employmentLetter || existingFirm.employmentLetter;
    existingFirm.coverLetter = coverLetter || existingFirm.coverLetter;
    existingFirm.signature = signature || existingFirm.signature;
    existingFirm.isActive = isActive || existingFirm.isActive;
    existingFirm.adminCreatedBy = adminCreatedBy || existingFirm.adminCreatedBy;
    existingFirm.adminCompanyName =
      adminCompanyName || existingFirm.adminCompanyName;

    const updatedFirm = await existingFirm.save();

    return NextResponse.json({
      message: "Firm updated successfully",
      success: true,
      status: 200,
      data: updatedFirm,
    });
  } catch (error) {
    console.error("Error updating firm:", error); // Log the error for debugging
    return NextResponse.json({
      error: "An error occurred while updating the firm",
      status: 500,
    });
  }
};

// GET handler for retrieving a specific product by ID
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.FirmID;

    // Find the product by ID
    const Find_User = await Firm.findById(id);

    // Check if the product exists
    if (!Find_User) {
      return NextResponse.json({ result: "No Firm Found", status: 404 });
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
    const id = context.params.FirmID;
    console.log("Firm ID:", id);

    // Connect to the database
    await connect();

    // Find the blog by ID
    const user = await Firm.findById(id);
    console.log("User:", user);

    if (!user) {
      return NextResponse.json({ message: "Firm not found", status: 404 });
    }

    const userPublicIdd = user.imagepublicId; // Ensure this matches your schema
    console.log("Image Public ID:", userPublicIdd);

    // Delete the blog from the database
    const deletedUser = await Firm.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({
        message: "Failed to delete Firm",
        status: 500,
      });
    }

    // Delete the image from Cloudinary if publicId exists
    if (userPublicIdd) {
      try {
        const cloudinaryResponse1 = await cloudinary.uploader.destroy(
          userPublicIdd
        );

        console.log(`Cloudinary response: ${cloudinaryResponse1.result}`);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    return NextResponse.json({
      message: "Firm and associated image deleted successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting User:", error);
    return NextResponse.json({ error: "Failed to delete Firm", status: 500 });
  }
}
