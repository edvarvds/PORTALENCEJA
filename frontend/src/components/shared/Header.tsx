import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://lh4.googleusercontent.com/proxy/_9Y0LIQJY1EdBdBVxy9MNsDDxrwGhfi2sjqj0zyi8ozsQS0eaxz82ZcL248lfPHCGJ3N07JVCIidVaFuR9pcnZNvpdEzt9bcLzGuHf9h09CpscRLpaqVYz0"
                alt="ENCCEJA"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 