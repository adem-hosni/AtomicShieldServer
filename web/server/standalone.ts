import { createServer } from "./index";

const app = createServer();
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});
