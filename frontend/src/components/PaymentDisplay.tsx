import React, { useState, useEffect } from 'react';

interface PaymentDisplayProps {
  paymentData: {
    qrCode: string;
    qrCodeImage: string;
    expirationDate: string;
    amount: number;
    productName: string;
    status: string;
  };
  onSuccess: () => void;
}

const PaymentDisplay: React.FC<PaymentDisplayProps> = ({ paymentData, onSuccess }) => {
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento do QR Code
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Timer para contagem regressiva
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(timer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyQRCode = () => {
    navigator.clipboard.writeText(paymentData.qrCode);
  };

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando QR Code do PIX...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pagamento via PIX</h3>
              <p className="text-gray-600">Escaneie o QR Code para pagar</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex justify-center mb-4">
                <img
                  src={paymentData.qrCodeImage}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Código PIX:</p>
                  <p className="font-mono text-sm break-all">{paymentData.qrCode}</p>
                </div>
                <button
                  onClick={handleCopyQRCode}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copiar código PIX</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tempo restante:</span>
                <span className={`text-lg font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Instruções:</h4>
              <ol className="text-sm text-blue-700 space-y-2">
                <li>1. Abra o app do seu banco</li>
                <li>2. Escolha pagar via PIX com QR Code</li>
                <li>3. Escaneie o código acima</li>
                <li>4. Confirme as informações e finalize o pagamento</li>
                <li>5. Aguarde a confirmação automática</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor:</span>
                <span className="text-lg font-semibold text-gray-900">
                  R$ {(paymentData.amount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDisplay; 