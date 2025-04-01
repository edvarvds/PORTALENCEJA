import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  cpf: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  nome_mae: { type: String },
  data_nascimento: { type: String, required: true },
  senha: { type: String, required: true },
  sexo: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  stepsCompleted: {
    locationConfirmed: { type: Boolean, default: false },
    studyMaterialsAccessed: { type: Boolean, default: false }
  }
});

const User = mongoose.model('User', userSchema);

export default User; 