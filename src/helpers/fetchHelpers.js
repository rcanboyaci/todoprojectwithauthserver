export const fetchWithHeaders = (url, method, body) => {
  let token = sessionStorage.getItem("jwttoken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "bearer " + token,
  };
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
