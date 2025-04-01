import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

interface User {
  cpf: string;
  nome: string;
  nome_mae: string;
  data_nascimento: string;
  sexo: string;
  lastLogin?: string;
  stepsCompleted?: {
    locationConfirmed: boolean;
    studyMaterialsAccessed: boolean;
  };
}

// Ícones do menu
const MenuIcons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  registration: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  exam: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  notice: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  results: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  certificate: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  help: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
};

const menuItems = [
  { id: 'home', label: 'Início', icon: MenuIcons.home },
  { id: 'profile', label: 'Meu Perfil', icon: MenuIcons.profile },
  { id: 'registration', label: 'Inscrição', icon: MenuIcons.registration },
  { id: 'exam', label: 'Provas', icon: MenuIcons.exam },
  { id: 'notice', label: 'Editais', icon: MenuIcons.notice },
  { id: 'calendar', label: 'Calendário', icon: MenuIcons.calendar },
  { id: 'results', label: 'Resultados', icon: MenuIcons.results },
  { id: 'help', label: 'Ajuda', icon: MenuIcons.help },
];

const Dashboard: React.FC = () => {
  usePageTitle('Portal do Aluno - ENCCEJA');
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);

  // Define steps at component level
  const steps = [
    { id: 'location', label: 'Local da Prova', completed: user?.stepsCompleted?.locationConfirmed },
    { id: 'materials', label: 'Apostila Complementar', completed: user?.stepsCompleted?.studyMaterialsAccessed }
  ];

  useEffect(() => {
    // Recuperar dados do usuário do localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if all steps are completed
      const stepsCompleted = parsedUser.stepsCompleted || {
        locationConfirmed: false,
        studyMaterialsAccessed: false,
      };
      
      if (!stepsCompleted.locationConfirmed || !stepsCompleted.studyMaterialsAccessed) {
        setShowStepsModal(true);
      }
    } else {
      // Se não houver dados do usuário, redirecionar para o login
      navigate('/login');
    }

    // Verificar se é um dispositivo móvel
    const checkMobile = () => {
      // Não vamos mais abrir o menu automaticamente em desktop
      setIsSidebarOpen(false);
    };

    // Verificar inicialmente
    checkMobile();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para formatar o CPF
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleStepClick = (step: 'location' | 'materials') => {
    setShowStepsModal(false);
    if (step === 'location') {
      navigate('/location-confirmation', { state: { from: '/dashboard' } });
    } else {
      navigate('/study-materials', { state: { from: '/dashboard' } });
    }
  };

  const handleMenuClick = (menuId: string) => {
    // Check if the page is blocked
    const isBlocked = !user?.stepsCompleted?.locationConfirmed || !user?.stepsCompleted?.studyMaterialsAccessed;
    const allowedPages = ['home', 'profile', 'registration'];
    
    if (isBlocked && !allowedPages.includes(menuId)) {
      return; // Don't change the active menu if the page is blocked
    }
    
    setActiveMenu(menuId);
    // Fechar o menu em mobile após selecionar um item
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    if (!user?.stepsCompleted?.locationConfirmed || !user?.stepsCompleted?.studyMaterialsAccessed) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.667-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-bold">Atenção!</span> Complete os passos necessários para desbloquear todas as funcionalidades do portal.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.completed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-500">{step.label}</span>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  if (!user) {
    return null; // ou um componente de loading
  }

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Steps Modal */}
      {showStepsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 relative max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setShowStepsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Bem-vindo ao Portal ENCCEJA!
                </h2>
                <p className="text-gray-600 text-base md:text-lg">
                  Siga os passos abaixo para desbloquear todas as funcionalidades
                </p>
              </div>

              {/* Step Indicator */}
              {renderStepIndicator()}
              
              <div className="space-y-4">
                <button
                  onClick={() => handleStepClick('location')}
                  className={`w-full flex items-center justify-between p-4 md:p-6 rounded-xl transition-all duration-200 shadow-lg ${
                    user?.stepsCompleted?.locationConfirmed
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className={`p-2 md:p-3 rounded-lg ${
                      user?.stepsCompleted?.locationConfirmed ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {MenuIcons.calendar}
                    </div>
                    <div className="text-left">
                      <span className="block text-base md:text-lg font-medium text-gray-900">
                        Confirmar local da prova
                      </span>
                      <span className="block text-sm text-gray-500">
                        {user?.stepsCompleted?.locationConfirmed 
                          ? 'Local confirmado com sucesso!'
                          : 'Obrigatório para efetivar sua inscrição'}
                      </span>
                    </div>
                  </div>
                  {!user?.stepsCompleted?.locationConfirmed && (
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => handleStepClick('materials')}
                  className={`w-full flex items-center justify-between p-4 md:p-6 rounded-xl transition-all duration-200 shadow-lg ${
                    user?.stepsCompleted?.studyMaterialsAccessed
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className={`p-2 md:p-3 rounded-lg ${
                      user?.stepsCompleted?.studyMaterialsAccessed ? 'bg-green-500' : 'bg-green-500'
                    }`}>
                      {MenuIcons.exam}
                    </div>
                    <div className="text-left">
                      <span className="block text-base md:text-lg font-medium text-gray-900">
                        Acessar apostila complementar
                      </span>
                      <span className="block text-sm text-gray-500">
                        {user?.stepsCompleted?.studyMaterialsAccessed
                          ? 'Material acessado com sucesso!'
                          : '100% de aprovação garantida!'}
                      </span>
                    </div>
                  </div>
                  {!user?.stepsCompleted?.studyMaterialsAccessed && (
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Progress Message */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-700">
                    {user?.stepsCompleted?.locationConfirmed && user?.stepsCompleted?.studyMaterialsAccessed
                      ? 'Parabéns! Todas as etapas foram concluídas!'
                      : `${steps.filter(s => s.completed).length} de ${steps.length} etapas concluídas`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para fechar o menu em mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo e Botão de Fechar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <img
            src="https://lh4.googleusercontent.com/proxy/_9Y0LIQJY1EdBdBVxy9MNsDDxrwGhfi2sjqj0zyi8ozsQS0eaxz82ZcL248lfPHCGJ3N07JVCIidVaFuR9pcnZNvpdEzt9bcLzGuHf9h09CpscRLpaqVYz0"
            alt="ENCCEJA"
            className="h-8"
          />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Fechar menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#2B4F81] flex items-center justify-center text-white font-semibold">
              {user.nome.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user.nome}</p>
              <p className="text-xs text-gray-500">CPF: {formatCPF(user.cpf)}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-4">
          {menuItems.map((item) => {
            const isBlocked = !user?.stepsCompleted?.locationConfirmed || !user?.stepsCompleted?.studyMaterialsAccessed;
            const allowedPages = ['home', 'profile', 'registration'];
            const isAllowed = allowedPages.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm ${
                  activeMenu === item.id
                    ? 'bg-[#2B4F81] text-white'
                    : isBlocked && !isAllowed
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                disabled={isBlocked && !isAllowed}
                title={isBlocked && !isAllowed ? 'Complete os passos pendentes para desbloquear' : ''}
              >
                {item.icon}
                <span>{item.label}</span>
                {isBlocked && !isAllowed && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 mt-4"
          >
            {MenuIcons.logout}
            <span>Sair</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100"
                title="Abrir menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-[#2B4F81]">
                {menuItems.find(item => item.id === activeMenu)?.label}
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Show warning for incomplete steps */}
          {renderContent()}

          {/* Welcome Card */}
          {activeMenu === 'home' && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Bem-vindo(a), {user.nome.split(' ')[0]}!
              </h2>
              <p className="text-gray-600">
                Aqui você pode acompanhar sua inscrição, consultar resultados e emitir certificados.
              </p>
            </div>
          )}

          {/* Profile Content */}
          {activeMenu === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados Pessoais</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nome Completo</p>
                  <p className="text-gray-800">{user.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="text-gray-800">{formatCPF(user.cpf)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nome da Mãe</p>
                  <p className="text-gray-800">{user.nome_mae}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="text-gray-800">{formatDate(user.data_nascimento)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sexo</p>
                  <p className="text-gray-800">{user.sexo === 'F' ? 'Feminino' : 'Masculino'}</p>
                </div>
                {user.lastLogin && (
                  <div>
                    <p className="text-sm text-gray-500">Último Acesso</p>
                    <p className="text-gray-800">{formatDate(user.lastLogin)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {activeMenu === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Próxima Prova */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Próxima Prova</h3>
                  {MenuIcons.calendar}
                </div>
                <p className="text-gray-600">Data: 15/08/2024</p>
                <p className="text-gray-600">Local: A definir</p>
              </div>

              {/* Status da Inscrição */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Status da Inscrição</h3>
                  {MenuIcons.registration}
                </div>
                <p className="text-green-600 font-medium">Confirmada</p>
                <p className="text-gray-600">Nº de Inscrição: 123456789</p>
              </div>

              {/* Último Edital */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Último Edital</h3>
                  {MenuIcons.notice}
                </div>
                <p className="text-gray-600">Edital ENCCEJA 2024</p>
                <button className="text-[#2B4F81] text-sm hover:underline mt-2">
                  Ver detalhes
                </button>
              </div>
            </div>
          )}

          {/* Blocked Content Message */}
          {!user.stepsCompleted?.locationConfirmed || !user.stepsCompleted?.studyMaterialsAccessed ? (
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Complete os passos pendentes para desbloquear todas as funcionalidades do portal.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStepsModal(true)}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2B4F81] hover:bg-[#1a3b68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B4F81]"
                >
                  Ver Passos
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 