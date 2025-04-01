import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'error' | 'success';
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'error', onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';
  const borderColor = type === 'error' ? 'border-red-200' : 'border-green-200';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor} ${borderColor} shadow-lg max-w-md animate-fade-in`}>
      <div className="flex justify-between items-center">
        <p className={`${textColor} font-medium`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 ${textColor} hover:opacity-70`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification; 