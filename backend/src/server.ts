import dotenv from 'dotenv';
dotenv.config();

// Now import your app. The app will have access to the loaded environment variables.
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});