const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("jwttoken")}`,
};

export const fetchWithHeaders = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body && JSON.stringify(body),
    });
    return response.json();
  } catch (err) {
    console.error(err.message);
  }
};
