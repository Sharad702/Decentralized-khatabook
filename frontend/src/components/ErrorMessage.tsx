import React from 'react';

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, retry }) => {
  const isMetaMaskError = message.toLowerCase().includes('metamask');

  if (isMetaMaskError) {
    return (
      <div className="metamask-error">
        <div className="metamask-logo">
          <svg viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.9583 1L19.8242 10.7183L22.2103 5.09497L32.9583 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.66699 1L15.68 10.8473L13.4152 5.09495L2.66699 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28.2292 23.5334L24.7097 28.872L32.2665 30.9138L34.4133 23.6392L28.2292 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.21484 23.6392L3.34886 30.9138L10.8925 28.872L7.38621 23.5334L1.21484 23.6392Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.4853 14.5149L8.4707 17.6507L15.9418 17.9829L15.6919 9.88599L10.4853 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25.1323 14.5149L19.8227 9.75699L19.6816 17.9829L27.1527 17.6507L25.1323 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.8929 28.872L15.4553 26.7144L11.5336 23.6816L10.8929 28.872Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.1682 26.7144L24.7098 28.872L24.0821 23.6816L20.1682 26.7144Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24.7098 28.8722L20.1682 26.7146L20.5268 29.6179L20.4915 30.7852L24.7098 28.8722Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.8926 28.8722L15.1109 30.7852L15.0887 29.6179L15.4243 26.7146L10.8926 28.8722Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.1932 21.7376L11.3975 20.6549L14.0535 19.4348L15.1932 21.7376Z" fill="#233447" stroke="#233447" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.4297 21.7376L21.5693 19.4348L24.2383 20.6549L20.4297 21.7376Z" fill="#233447" stroke="#233447" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.8925 28.872L11.5584 23.5334L7.38623 23.6392L10.8925 28.872Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24.0645 23.5334L24.7098 28.872L28.2292 23.6392L24.0645 23.5334Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M27.1527 17.6506L19.6816 17.9829L20.4303 21.7376L21.5699 19.4348L24.2389 20.6549L27.1527 17.6506Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.3975 20.6549L14.0534 19.4348L15.1931 21.7376L15.9418 17.9829L8.4707 17.6506L11.3975 20.6549Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.4707 17.6506L11.5332 23.6817L11.3975 20.6549L8.4707 17.6506Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24.2391 20.6549L24.0821 23.6817L27.1528 17.6506L24.2391 20.6549Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.9421 17.9829L15.1934 21.7376L16.1391 26.2666L16.2983 20.3227L15.9421 17.9829Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.6815 17.9829L19.3384 20.3096L19.4845 26.2666L20.4301 21.7376L19.6815 17.9829Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.4303 21.7377L19.4846 26.2666L20.1681 26.7145L24.0821 23.6817L24.239 20.655L20.4303 21.7377Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.3975 20.655L11.5337 23.6817L15.4477 26.7145L16.1312 26.2666L15.1932 21.7377L11.3975 20.655Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.4916 30.7851L20.5269 29.6178L20.1914 29.3293H15.4245L15.1059 29.6178L15.1111 30.7851L10.8928 28.8721L12.3873 30.0922L15.3731 32.1471H20.2191L23.218 30.0922L24.7095 28.8721L20.4916 30.7851Z" fill="#C0AC9D" stroke="#C0AC9D" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.1678 26.7144L19.4842 26.2665H16.1312L15.4557 26.7144L15.1201 29.6178L15.4387 29.3293H20.2056L20.5411 29.6178L20.1678 26.7144Z" fill="#161616" stroke="#161616" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M33.5168 11.3532L34.6299 6.0393L32.9579 1L20.168 10.4297L25.1319 14.5149L32.06 16.4995L33.5879 14.7372L32.9305 14.2764L33.9903 13.3549L33.2071 12.7652L34.2669 11.9857L33.5168 11.3532Z" fill="#763E1A" stroke="#763E1A" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M0.992188 6.0393L2.11828 11.3532L1.34515 11.9857L2.41799 12.7652L1.62182 13.3549L2.6816 14.2764L2.02422 14.7372L3.55214 16.4995L10.4803 14.5149L15.4442 10.4297L2.66729 1L0.992188 6.0393Z" fill="#763E1A" stroke="#763E1A" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M32.0602 16.4995L25.1321 14.5149L27.1525 17.6507L24.0818 23.6818L28.2297 23.6392H34.4138L32.0602 16.4995Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.4804 14.5149L3.55225 16.4995L1.21191 23.6392H7.38627L11.5342 23.6818L8.47081 17.6507L10.4804 14.5149Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.6812 17.983L20.1686 10.4297L22.2097 5.09497H13.415L15.4443 10.4297L15.9418 17.983L16.1283 20.3359L16.1412 26.2666H19.4818L19.5077 20.3359L19.6812 17.983Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="metamask-error-message">
          {message}
        </div>
        {retry && (
          <button
            onClick={retry}
            className="metamask-retry-button"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6 max-w-md mx-auto text-center shadow-sm">
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0 mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <svg className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-base font-medium text-red-700 mb-3">
            {message}
          </p>
          {retry && (
            <button
              onClick={retry}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage; 