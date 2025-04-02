import { useState } from 'react';
import { API_ENDPOINTS } from '../config';

interface PaymentData {
  qrCode: string;
  qrCodeImage: string;
  expirationDate: string;
  amount: number;
  productName: string;
  status: string;
}

interface UsePaymentProps {
  amount: number;
  productName: string;
  onSuccess?: (data: any) => void;
}

export const usePayment = ({ amount, productName, onSuccess }: UsePaymentProps) => {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const generatePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found');
      }

      const user = JSON.parse(userData);

      // Validate required user data
      if (!user.nome || !user.cpf) {
        throw new Error('Invalid user data: name and CPF are required');
      }

      // Create payment request
      const paymentData = {
        amount,
        name: user.nome,
        cpf: user.cpf.replace(/\D/g, ''), // Remove non-digits from CPF
        email: `${user.cpf.replace(/\D/g, '')}@placeholder.com`,
        phone: "11999999999", // Default phone number
        productName
      };

      // Make direct request to backend
      const response = await fetch(`${API_ENDPOINTS.payment}/create-pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.id && data.pixCode && data.pixQrCode) {
        setPaymentData({
          qrCode: data.pixCode,
          qrCodeImage: data.pixQrCode,
          expirationDate: data.expiresAt,
          amount,
          productName,
          status: data.status
        });
        
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        setError('Invalid payment data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
  };

  return {
    paymentData,
    isLoading,
    error,
    showPaymentModal,
    setShowPaymentModal,
    generatePayment,
    handlePaymentSuccess
  };
}; 