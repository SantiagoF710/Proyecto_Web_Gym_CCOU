
import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  documento: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  actividad: {
    type: String,
    required: true,
    enum: ['musculacion', 'yoga', 'zumba', 'pilates', 'rehabilitacion'],
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario', 
  },
});

export const Usuario = mongoose.model('Usuario', usuarioSchema);