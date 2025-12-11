
import mongoose from 'mongoose';

const RutinaSchema = new mongoose.Schema(
  {
    documento: {
      type: String,
      required: true,
      trim: true,
    },
    dia: {
      type: String,
      required: true,
      trim: true,
      enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado/Domingo'],
    },
    ejercicio: {
      type: String,
      required: true,
      trim: true,
    },
    series: {
      type: Number,
      required: true,
      min: 1,
    },
    repeticiones: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'rutinas',
  }
);

export const modeloRutinas = mongoose.model('Rutina', RutinaSchema);