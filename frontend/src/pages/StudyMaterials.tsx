import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePayment } from '../hooks/usePayment';
import PaymentDisplay from '../components/PaymentDisplay';
import PortalLayout from '../components/PortalLayout';

const StudyMaterials: React.FC = () => {
  usePageTitle('Apostila de Estudos - ENCCEJA');
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { paymentData, isLoading, error, generatePayment, handlePaymentSuccess } = usePayment({
    amount: 4780,
    productName: "Localdaprova:Material de Estudos",
    onSuccess: (data) => {
      setHasAccess(true);
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleAccessMaterial = async () => {
    await generatePayment();
    setShowPaymentModal(true);
  };

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Material Completo para ENCCEJA
            </h2>
            <p className="text-gray-600">
              Prepare-se com nosso material exclusivo e atualizado
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">O que está incluído?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Material completo para todas as áreas do conhecimento</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Exercícios práticos com gabarito comentado</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Simulados inéditos</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Dicas e estratégias para a prova</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Material permitido para consulta durante a prova</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-green-900 mb-4">Oferta Especial</h3>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-900 mb-2">R$ 47,80</p>
              <p className="text-green-800">Acesso vitalício ao material</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAccessMaterial}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Acessar Material Agora
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Pagamento via PIX</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600">Gerando pagamento...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-600">{error}</p>
              </div>
            ) : paymentData ? (
              <PaymentDisplay paymentData={paymentData} onSuccess={handlePaymentSuccess} />
            ) : null}
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default StudyMaterials; 