
import mongoose from 'mongoose';

const urlDatabase = process.env.MONGODB_URI || 'mongodb+srv://santi71043:orFWgLK4NxwAb6Wd@cluster0.q9d8z8m.mongodb.net/GymCCOU?retryWrites=true&w=majority&appName=Cluster0';

export const conectarDB = () => {
  return mongoose
    .connect(urlDatabase)
    .then(() => {
      console.log('Conectado a la BD!');
    })
    .catch((error) => {
      console.log('Error conectando a la DB:', error);
    });
};
