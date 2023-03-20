const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("jwttoken")}`,
};

export const fetchWithHeaders = async (url, method, body) => {
  const response = await fetch(url, {
    method,
    headers,
    body: body && JSON.stringify(body),
  });
  return response.json().catch((err) => {
    console.log(err.messsage);
  });
};
