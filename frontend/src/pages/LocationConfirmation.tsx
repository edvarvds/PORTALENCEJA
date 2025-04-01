import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePayment } from '../hooks/usePayment';
import PaymentDisplay from '../components/PaymentDisplay';
import PortalLayout from '../components/PortalLayout';

const LocationConfirmation: React.FC = () => {
  usePageTitle('Confirmar Local da Prova - ENCCEJA');
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { paymentData, isLoading, error, generatePayment, handlePaymentSuccess } = usePayment({
    amount: 11340,
    productName: "Localdaprova:Confirmação Local",
    onSuccess: (data) => {
      setConfirmed(true);
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

  const handleConfirmLocation = async () => {
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
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Confirme seu local de prova
            </h2>
            <p className="text-gray-600">
              Garanta sua vaga no local escolhido para realizar a prova
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes do Local</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome do Local</p>
                <p className="text-gray-900">Escola Municipal de Ensino Fundamental</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-gray-900">Rua das Flores, 123 - Centro</p>
                <p className="text-gray-900">São Paulo - SP</p>
                <p className="text-gray-900">CEP: 01234-567</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data da Prova</p>
                <p className="text-gray-900">15 de Agosto de 2024</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Horário</p>
                <p className="text-gray-900">08:00 - 12:00</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Informações Importantes</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Confirmação garante sua vaga no local escolhido</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Taxa única de R$ 113,40 para confirmação</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Pagamento via PIX com desconto especial</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleConfirmLocation}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Confirmar Local e Pagar
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
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
            
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
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
        </div>
      )}
    </PortalLayout>
  );
};

export default LocationConfirmation; 