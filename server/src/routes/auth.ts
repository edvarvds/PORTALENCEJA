import express from 'express';
import axios from 'axios';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_URL = 'https://consulta.fontesderenda.blog/cpf.php';
const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
  throw new Error('API_TOKEN is not defined in environment variables');
}

// Função para formatar a data de nascimento para o formato ddmmaaaa
const formatBirthDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}${month}${year}`;
};

router.post('/login', async (req, res) => {
  try {
    const { cpf, password } = req.body;
    console.log('Received login request for CPF:', cpf);

    if (!password || password.length !== 8) {
      console.log('Invalid password length');
      return res.status(400).json({ 
        success: false, 
        message: 'Senha incorreta.' 
      });
    }

    // Consulta à API externa
    const url = `${API_URL}?token=${API_TOKEN}&cpf=${cpf}`;
    console.log('Requesting external API:', url);

    const response = await axios.get(url);
    console.log('External API response:', response.data);

    if (response.data.DADOS) {
      const userData = response.data.DADOS;
      console.log('User data from API:', userData);

      // Verifica se todos os campos necessários estão presentes
      if (!userData.nome || !userData.data_nascimento) {
        console.error('Missing required fields in API response:', userData);
        return res.status(400).json({ 
          success: false, 
          message: 'Dados incompletos na resposta da API'
        });
      }

      // Formata a data de nascimento para comparar com a senha
      const formattedBirthDate = formatBirthDate(userData.data_nascimento);
      console.log('Formatted birth date:', formattedBirthDate);
      
      // Verifica se a senha corresponde à data de nascimento
      if (password !== formattedBirthDate) {
        console.log('Password does not match birth date');
        return res.status(401).json({
          success: false,
          message: 'Senha incorreta.'
        });
      }

      // Verifica se o usuário já existe
      let user = await User.findOne({ cpf });
      console.log('Existing user:', user);

      if (!user) {
        // Cria novo usuário
        user = await User.create({
          cpf,
          nome: userData.nome,
          nome_mae: userData.nome_mae || '',
          data_nascimento: userData.data_nascimento,
          senha: formattedBirthDate,
          sexo: userData.sexo || '',
          lastLogin: new Date()
        });
        console.log('Created new user:', user);
      } else {
        // Atualiza último login e senha se necessário
        user.lastLogin = new Date();
        if (!user.senha) {
          user.senha = formattedBirthDate;
        }
        await user.save();
        console.log('Updated existing user:', user);
      }

      console.log('Sending success response with user data');
      res.json({ success: true, user });
    } else {
      console.log('Invalid CPF in API response');
      res.status(400).json({ success: false, message: 'CPF inválido' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

export default router; 