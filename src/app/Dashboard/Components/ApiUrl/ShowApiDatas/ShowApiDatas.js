// api.js
import axios from "axios";
// API`S
import {
  API_URL_USER,
  API_URL_Driver,
  API_URL_Enquiry,
  API_URL_Firm,
  API_URL_Insurence,
  API_URL_LocalAuthority,
  API_URL_Manufacturer,
  API_URL_Payment,
  API_URL_Signature,
  API_URL_Supplier,
  API_URL_Vehicle,
  API_URL_VehicleType,
  API_URL_Title,
  API_URL_Badge,
  API_URL_Employee,
  API_URL_Company,
  API_URL_Transmission,
  API_URL_FuelType,
  API_URL_Type,
  API_URL_CarModel,
  API_URL_Driver_Vehicle_Allotment,
} from "../ApiUrls.js";

export const GetUsers = () => {
  let companyName = localStorage.getItem("companyName"); // Get the company name from local storage
  let flag = localStorage.getItem("flag");
  let superadmin = localStorage.getItem("role");
  return axios
    .get(`${API_URL_USER}`)
    .then((res) => {
      let users = res.data.result;

      // Check if superadmin and flag values are "superadmin" and "false"
      if (superadmin === "superadmin" && flag === "false") {
        // Superadmin can view all users, no filtering needed
        return { result: users, count: users.length };
      } else {
        // Filter users by company name for both other cases
        users = users.filter((user) => user.companyname === companyName);
        return { result: users, count: users.length };
      }
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      throw error;
    });
};
export const GetDriver = () => {
  let companyName = localStorage.getItem("companyName"); // Get the company name from local storage
  let flag = localStorage.getItem("flag");
  let superadmin = localStorage.getItem("role");
  return axios
    .get(`${API_URL_Driver}`)
    .then((res) => {
      let driver = res.data;
      if (superadmin === "superadmin" && flag === "false") {
        // If superadmin and flag are set to show all drivers, return full result
        return { result: driver.result, count: driver.count };
      } else if (superadmin === "superadmin" && flag === "true") {
        return { result: driver.result, count: driver.count };
      } else {
        // Filter the drivers based on the company name
        const filteredDrivers = driver.result.filter(
          (d) => d.companyname === companyName
        );
        // Return the filtered result and update the count
        return { result: filteredDrivers, count: filteredDrivers.length };
      }
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetEnquiry = () => {
  return axios
    .get(`${API_URL_Enquiry}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetFirm = () => {
  return axios
    .get(`${API_URL_Firm}`)
    .then((res) => {
      // console.log(res.data.result);
      // console.log(res.data.count);
      return { result: res.data.result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetCompany = () => {
  return axios
    .get(`${API_URL_Company}`)
    .then((res) => {
      // console.log(res.data.result);
      // console.log(res.data.count);
      return { result: res.data.result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetInsurence = () => {
  return axios
    .get(`${API_URL_Insurence}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetEmployee = () => {
  return axios
    .get(`${API_URL_Employee}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetLocalAuthority = () => {
  return axios
    .get(`${API_URL_LocalAuthority}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetManufacturer = () => {
  return axios
    .get(`${API_URL_Manufacturer}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetPayment = () => {
  return axios
    .get(`${API_URL_Payment}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetTransmissions = () => {
  return axios
    .get(`${API_URL_Transmission}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetFueltype = () => {
  return axios
    .get(`${API_URL_FuelType}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const Gettype = () => {
  return axios
    .get(`${API_URL_Type}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetSignature = () => {
  return axios
    .get(`${API_URL_Signature}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetSupplier = () => {
  return axios
    .get(`${API_URL_Supplier}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetVehicleType = () => {
  return axios
    .get(`${API_URL_VehicleType}`)
    .then((res) => {
      // console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetVehicle = () => {
  let companyName = localStorage.getItem("companyName"); // Get the company name from local storage
  let flag = localStorage.getItem("flag");
  let superadmin = localStorage.getItem("role");
  return axios
    .get(`${API_URL_Vehicle}`)
    .then((res) => {
      let vehicle = res.data;
      // console.log(vehicle);
      if (superadmin === "superadmin" && flag === "false") {
        // If superadmin and flag are set to show all drivers, return full result
        return { result: vehicle.result, count: vehicle.count };
      } else if (superadmin === "superadmin" && flag === "true") {
        // console.log(vehicle.result, vehicle.count);
        return { result: vehicle.result, count: vehicle.count };
      } else {
        // Filter the drivers based on the company name
        const filteredDrivers = vehicle.Result.filter(
          (d) => d.companyname === companyName
        );
        // Return the filtered result and update the count
        return { result: filteredDrivers, count: filteredDrivers.length };
      }
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetTitle = () => {
  return axios
    .get(`${API_URL_Title}`)
    .then((res) => {
      // console.log(res.data.result);
      // console.log(res.data.count);
      return { result: res.data.result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetCarModel = () => {
  return axios
    .get(`${API_URL_CarModel}`)
    .then((res) => {
      // console.log(res.data.result);
      // console.log(res.data.count);
      return { result: res.data.result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetBadge = () => {
  return axios
    .get(`${API_URL_Badge}`)
    .then((res) => {
      // console.log(res.data.result);
      // console.log(res.data.count);
      return { result: res.data.result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetDriverVehicleAllotment = () => {
  let companyName = localStorage.getItem("companyName"); // Get the company name from local storage
  let flag = localStorage.getItem("flag");
  let superadmin = localStorage.getItem("role");
  return axios
    .get(`${API_URL_Driver_Vehicle_Allotment}`)
    .then((res) => {
      let drivervehicle = res.data;
      // console.log(res.data.Result);
      // console.log(res.data.count);

      if (superadmin === "superadmin" && flag === "false") {
        // If superadmin and flag are set to show all drivers, return full result
        return { result: drivervehicle.Result, count: drivervehicle.count };
      } else if (superadmin === "superadmin" && flag === "true") {
        // console.log(vehicle.result, vehicle.count);
        return { result: drivervehicle.Result, count: drivervehicle.count };
      } else {
        // Filter the drivers based on the company name
        const filteredDrivers = drivervehicle.Result.filter(
          (d) => d.companyname === companyName
        );
        // Return the filtered result and update the count
        return { result: filteredDrivers, count: filteredDrivers.length };
      }
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
