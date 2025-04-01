import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import Notification from '../components/shared/Notification';
import Modal from '../components/shared/Modal';
import { usePageTitle } from '../hooks/usePageTitle';

const API_URL = 'http://localhost:3001/api/auth';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    cpf: string;
    nome: string;
    nome_mae: string;
    data_nascimento: string;
    sexo: string;
    lastLogin: string;
  };
}

const Login: React.FC = () => {
  usePageTitle('Login');
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    } else if (numbers.length <= 9) {
      return numbers.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else {
      return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').substring(0, 14);
    }
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    
    // Se ainda não tiver 11 dígitos, considera como em digitação
    if (numbers.length < 11) return true;
    
    // Check for known invalid CPFs
    if (/^(\d)\1+$/.test(numbers)) return false;
    
    // Validate first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;
    
    // Validate second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) {
      setNotification({ message: 'CPF deve conter 11 dígitos.', type: 'error' });
      return;
    }
    
    if (!validateCPF(cpf)) {
      setNotification({ message: 'CPF inválido.', type: 'error' });
      return;
    }

    if (password.length !== 8) {
      setNotification({ message: 'Senha incorreta.', type: 'error' });
      return;
    }

    // Validar se a senha está no formato correto (ddmmaaaa)
    const passwordRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/;
    if (!passwordRegex.test(password)) {
      setNotification({ message: 'Senha incorreta.', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Enviando requisição de login...');
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cpf: numbers,
          password: password 
        }),
      });

      console.log('Resposta recebida:', response.status);
      const data: LoginResponse = await response.json();
      console.log('Dados da resposta:', data);

      if (data.success && data.user) {
        console.log('Login bem sucedido, salvando dados do usuário...');
        // Salvar dados do usuário no localStorage
        localStorage.setItem('userData', JSON.stringify(data.user));
        console.log('Dados salvos, redirecionando para o dashboard...');
        // Navegar para o dashboard
        navigate('/dashboard');
      } else {
        console.log('Login falhou:', data.message);
        setNotification({ message: data.message === 'Senha incorreta. Use sua data de nascimento no formato ddmmaaaa' 
          ? 'Senha incorreta.'
          : (data.message || 'Erro ao fazer login.'), type: 'error' });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setNotification({ message: 'Erro ao conectar com o servidor.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="Esqueceu sua senha?"
      >
        <div className="text-gray-600">
          <p className="mb-4">
            A sua senha de acesso é a sua data de nascimento no formato:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-mono text-center text-lg">
              <span className="text-blue-600">dd</span>
              <span className="text-green-600">mm</span>
              <span className="text-red-600">aaaa</span>
            </p>
            <div className="flex justify-center gap-2 mt-2 text-sm">
              <span className="text-blue-600">dia</span>
              <span className="text-green-600">mês</span>
              <span className="text-red-600">ano</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Exemplo: Se você nasceu em 15 de março de 1990, sua senha será: <span className="font-mono font-medium">15031990</span>
          </p>
        </div>
      </Modal>

      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* ENCCEJA Logo */}
          <div className="text-center mb-8">
            <img
              alt="Logo ENCCEJA 2025"
              className="mx-auto"
              height="100"
              src="https://lh4.googleusercontent.com/proxy/_9Y0LIQJY1EdBdBVxy9MNsDDxrwGhfi2sjqj0zyi8ozsQS0eaxz82ZcL248lfPHCGJ3N07JVCIidVaFuR9pcnZNvpdEzt9bcLzGuHf9h09CpscRLpaqVYz0"
              width="420"
            />
          </div>

          {/* Portal do Aluno Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center space-x-2 mb-2">
              <svg className="w-6 h-6 text-[#2B4F81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h2 className="text-2xl font-semibold text-[#2B4F81]">Portal do Aluno</h2>
            </div>
            <p className="text-gray-600">Acesse sua área exclusiva do ENCCEJA</p>
          </div>

          {/* Login Form Container */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm mx-4">
            {/* Form Header */}
            <div className="bg-[#2B4F81] text-white p-4 rounded-t-lg">
              <h2 className="text-lg font-medium">Login {'>'} ENCCEJA</h2>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} id="loginForm">
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    <span>CPF</span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="cpf"
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#2B4F81] focus:border-transparent"
                    placeholder="___.___.___-__"
                    type="tel"
                    inputMode="numeric"
                    value={cpf}
                    onChange={handleCPFChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    <span>Senha</span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="password"
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#2B4F81] focus:border-transparent"
                    type="password"
                    placeholder="ddmmaaaa"
                    maxLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').substring(0, 8))}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#2B4F81] border-gray-300 rounded focus:ring-[#2B4F81]" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Lembrar-me</span>
                  </label>
                </div>

                <div className="mb-6">
                  <button 
                    type="button"
                    onClick={() => setIsHelpModalOpen(true)}
                    className="text-[#2B4F81] text-sm hover:underline"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>

                <div className="flex justify-end items-center">
                  <button
                    type="submit"
                    className={`bg-[#2B4F81] text-white px-8 py-3 rounded hover:bg-[#1a3b68] transition-colors ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login; 