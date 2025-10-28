import { jwtDecode } from "jwt-decode";

export default function getUserRole() {
  const token = localStorage.getItem("access_token");
  let userRole = null; // This is the default role for every new user
  if (token) {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.role);
    // Read the role from the role claim in the payload
    userRole = decodedToken.role;
  }

  const isAdmin = userRole === "admin" || userRole === "super_user";

  return { userRole, isAdmin };
}
