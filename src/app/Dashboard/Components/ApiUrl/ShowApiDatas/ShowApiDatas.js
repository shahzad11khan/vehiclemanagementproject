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
} from "../ApiUrls.js";

export const GetUsers = () => {
  return axios
    .get(`${API_URL_USER}`)
    .then((res) => {
      console.log(res.data.result);
      console.log(res.data.count);
      return { result: res.data.result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetDriver = () => {
  return axios
    .get(`${API_URL_Driver}`)
    .then((res) => {
      console.log(res.data.Result);
      console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
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
      console.log(res.data.Result);
      console.log(res.data.count);
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
      console.log(res.data.result);
      console.log(res.data.count);
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
      console.log(res.data.result);
      console.log(res.data.count);
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
      console.log(res.data.Result);
      console.log(res.data.count);
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
      console.log(res.data.Result);
      console.log(res.data.count);
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
      console.log(res.data.Result);
      console.log(res.data.count);
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
      console.log(res.data.Result);
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
      console.log(res.data.Result);
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
      console.log(res.data.Result);
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
      console.log(res.data.Result);
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
      console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
export const GetVehicle = () => {
  return axios
    .get(`${API_URL_Vehicle}`)
    .then((res) => {
      console.log(res.data.Result);
      // console.log(res.data.count);
      return { result: res.data.Result, count: res.data.count };
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
      console.log(res.data.result);
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
      console.log(res.data.result);
      // console.log(res.data.count);
      return { result: res.data.result, count: res.data.count };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
