const API_URL =
  "http://localhost:5000/api";


export const getAuthHeaders = () => {

  const token =
    localStorage.getItem("token");


  return {
    Authorization:
      token
        ? `Bearer ${token}`
        : "",
  };

};


export default API_URL;