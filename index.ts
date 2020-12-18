import { createServer } from 'http';
import { app } from './src/app';
import { sequelize } from './src/sequelize';

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await sequelize.sync();
    console.log('💡💡💡 Sequelize Connected 💡💡💡');
    createServer(app).listen(PORT, () => {
      console.log(`💡💡💡 Server on http://localhost:${PORT} 💡💡💡`);
    });
  } catch(err) {
    console.error(err);
  }
})();