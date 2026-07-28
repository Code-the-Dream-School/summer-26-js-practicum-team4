require('dotenv').config();

/* Check JWT_SECRET before the server starts accepting requests.This prevents users from being left in a partially registered state if their account is created but the authentication token cannot be generated.*/
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured');
}

const app = require('./src/app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
