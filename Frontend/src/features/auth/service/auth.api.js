import axios from "axios";


const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function register({ email, contact, fullname, password, isSeller }) {
  const response = await authApiInstance.post("/register", {
    email,
    contact,
    fullname,
    password,
    isSeller
  });
  return response.data;

}

export async function login({ email, password }) {
  const response = await authApiInstance.post("/login", {
    email,
    password
  });
  return response.data;
}

export async function getMe() {
  const responce = await authApiInstance.get("/me")

  return responce.data
}