import { connect } from "@config/db.js";
import User from "@models/User/User.Model.js";
import cloudinary from "@middlewares/cloudinary.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(request) {
  try {
    await connect();
    const data = await request.formData();

    // Handling the uploaded files
    let file1 = data.get("useravatar");
    // console.log("User Avatar:", file1);

    let useravatar = "";
    let useravatarId = "";

    // Upload files to Cloudinary
    if (!file1) {
      useravatar =
        "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg";
      useravatarId = "123456789";
    } else {
      // Set a dummy `imageId` for the default image}else{
      try {
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
      } catch (error) {
        useravatar =
          "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg";
        useravatarId = "123456789";
      }
    }
    // Constructing formDataObject excluding the files
    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      if (key !== "useravatar") {
        formDataObject[key] = value;
      }
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
      // accessLevel,
      dateOfBirth,
      position,
      reportsTo,
      username,
      password,
      passwordExpires,
      // passwordExpiresEvery,
      confirmpassword,
      companyName,
      CreatedBy,
      isActive,
      role,
      companyId,
      Postcode,
    BuildingAndStreetOne,
    BuildingAndStreetTwo,
    Town_City,
    Country,
    } = formDataObject;
    if (password !== confirmpassword) {
      return NextResponse.json({
        error: "Passwords does not match",
        status: 400,
      });
    }

    // // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);
    // // Check if a user with the same email or company name already exists
    // const existingUser = await User.findOne({
    //    $and: [{ email: email }, { companyname: companyname }],
    // });
    // if (!existingUser) {
    //   return NextResponse.json({
    //     error: "User Email and Company is already exists",
    //     status: 400,
    //   });
    // }
    // const existingUserByEmail = await User.findOne({ email: email });

    // Hash the password

// Check if a user with the same email or company name already exists
const existingUser = await User.findOne({
  $or: [{ email: email }, { companyName: companyName }, {confirmpassword : password}],
});

if (existingUser) {
  // Check if the email exists alone or the company name exists
  if (existingUser.email === email && existingUser.companyName === companyName) {
    return NextResponse.json({
      error: "User with this email and company name already in use",
      status: 400,
    });
  } else if (existingUser.email === email && existingUser.companyName === companyName && existingUser.confirmpassword === password) {
    return NextResponse.json({
      error: "User with this email And Password already in use",
      status: 400,
    });
  } 
  else if (existingUser.email === email) {
    return NextResponse.json({
      error: "User with this email already in use",
      status: 400,
    });
  } 
}

// Continue with user registration logic if no conflict is found

const hashedPassword = await bcrypt.hash(password, 10);
    // Create and save the new blog entry
    const newUser = new User({
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
      // accessLevel,
      dateOfBirth,
      position,
      reportsTo,
      username,
      password: hashedPassword,
      passwordExpires,
      // passwordExpiresEvery,
      confirmpassword,
      companyName,
      CreatedBy, // Ensure this field matches your schema
      useravatar: useravatar, // Use the uploaded or dummy image
      userPublicId: useravatarId,
      isActive: isActive || false,
      adminCreatedBy: CreatedBy,
      role: role || "user", // Default to "user" if no role is specified
      companyId,
      Postcode,
    BuildingAndStreetOne,
    BuildingAndStreetTwo,
    Town_City,
    Country,
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

// export async function POST(request) {
//   try {
//     await connect();
//     const data = await request.formData();
//     // Extract and verify the token
//     const token = request.headers.get("authorization")?.split(" ")[1];
//     console.log(token);
//     if (!token) {
//       return NextResponse.json({ error: "No token provided", status: 401 });
//     }
//    jwt.verify(token, secret, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: "Token is not valid" });
//     }

//     // Token is valid, you can attach the decoded payload to the request object
//     req.user = decoded; // Attach the decoded user info to the request

//     // console.log(req.user);
//     next(); // Call the next middleware or route handler
//   });

//     // return;
//     // Handling the uploaded files
//     let file1 = data.get("useravatar");
//     console.log("User Avatar:", file1);

//     let file2 = data.get("companyavatar");
//     if (!file1) {
//       console.log(
//         "Company Avatar not provided, using User Avatar as fallback."
//       );
//       file1 = file2; // Use file1 as fallback if file2 is not provided
//     } else {
//       console.log("Company Avatar:", file2);
//       file2 = file1;
//     }

//     let useravatar = "";
//     let useravatarId = "";
//     let companyavatarImage = "";
//     let companyavatarId = "";

//     // Upload files to Cloudinary
//     if (file1) {
//       const buffer1 = Buffer.from(await file1.arrayBuffer());
//       const uploadResponse1 = await new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream(
//             {
//               resource_type: "auto",
//             },
//             (error, result) => {
//               if (error) {
//                 reject(
//                   new Error("Error uploading displayImage: " + error.message)
//                 );
//               } else {
//                 resolve(result);
//               }
//             }
//           )
//           .end(buffer1);
//       });

//       useravatar = uploadResponse1.secure_url; // Cloudinary URL for display image
//       useravatarId = uploadResponse1.public_id;
//     }

//     if (file2) {
//       const buffer2 = Buffer.from(await file2.arrayBuffer());
//       const uploadResponse2 = await new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream(
//             {
//               resource_type: "auto",
//             },
//             (error, result) => {
//               if (error) {
//                 reject(
//                   new Error("Error uploading authorImage: " + error.message)
//                 );
//               } else {
//                 resolve(result);
//               }
//             }
//           )
//           .end(buffer2);
//       });

//       companyavatarImage = uploadResponse2.secure_url; // Cloudinary URL for author image
//       companyavatarId = uploadResponse2.public_id;
//     }

//     // Constructing formDataObject excluding the files
//     const formDataObject = {};
//     for (const [key, value] of data.entries()) {
//       if (key !== "useravatar" && key !== "companyavatar") {
//         formDataObject[key] = value;
//       }
//     }

//     const {
//       username,
//       email,
//       password,
//       companyname,
//       confirmpassword,
//       isActive,
//       role,
//     } = formDataObject;
//     if (password !== confirmpassword) {
//       return NextResponse.json({
//         error: "Passwords do not match",
//         status: 400,
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({
//         error: "User with this email already exists",
//         status: 400,
//       });
//     }

//     // Create and save the new blog entry
//     // const newUser = new User({
//     //   username,
//     //   email,
//     //   password: hashedPassword,
//     //   companyname,
//     //   confirmpassword,
//     //   useravatar: useravatar, // Use the uploaded or dummy image
//     //   userPublicId: useravatarId,
//     //   companyavatar: companyavatarImage, // Use the uploaded or dummy image
//     //   companyPublicId: companyavatarId,
//     //   isActive: isActive || false,
//     //   role: role || "user", // Default to "user" if no role is specified
//     // });

//     console.log(newUser);

//     // return;

//     const savedUser = await newUser.save();
//     if (!savedUser) {
//       return NextResponse.json({ message: "User not added", status: 400 });
//     } else {
//       return NextResponse.json({
//         message: "User created successfully",
//         success: true,
//         status: 200,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message, status: 500 });
//   }
// }

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allUsers = await User.find().sort({ createdAt: -1 }).populate("companyId");
  const userCount = await User.countDocuments();
  if (!allUsers || allUsers.length === 0) {
    return NextResponse.json({ result: allUsers });
  } else {
    return NextResponse.json({ result: allUsers, count: userCount });
  }
});
