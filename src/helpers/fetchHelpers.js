// import config from "../config";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("jwttoken")}`,
};

export const fetchWithHeaders = (url, method, body) => {
  try {
    const response = fetch(url, {     
      method,
      headers,
      body: body && JSON.stringify(body),
    });
    return response.then((res) => {
      return res.json();
    });
  } catch (err) {
    console.error(err.message);
  }
};
// config.baseUrl 