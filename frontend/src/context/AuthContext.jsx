const response = await loginUser(email, password);
const userData = response.data;

// Make sure the role is included when setting the user
setUser({
  ...userData,
  role: userData.role // This should be "ADMIN" from your database
}); 