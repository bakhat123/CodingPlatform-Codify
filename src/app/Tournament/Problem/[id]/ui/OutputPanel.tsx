import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

type OutputPanelProps = {
  output: string;
  error: string;
};

const OutputPanel: React.FC<OutputPanelProps> = ({ output, error }) => {
  return (
    <div className='h-full overflow-auto custom-scrollbar'>
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-red-900/20 p-6 rounded-lg border border-red-800 shadow-lg'
          >
            <div className='flex items-start'>
              <div className='bg-red-900/40 p-2 rounded-lg mr-3'>
                <AlertTriangle className='text-red-400 w-5 h-5' />
              </div>
              <div>
                <h3 className='text-lg font-medium text-red-400 mb-2'>Error</h3>
                <pre className='text-sm font-mono text-red-200 whitespace-pre-wrap break-words'>
                  {error}
                </pre>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='text-sm font-mono'
          >
            {output ? (
              <div className='whitespace-pre-wrap text-gray-100'>{output}</div>
            ) : (
              <div className='flex flex-col items-center justify-center h-64 text-center p-4'>
                <div className='w-16 h-16 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center'>
                  <svg 
                    className='w-8 h-8 text-blue-400' 
                    fill='none' 
                    stroke='currentColor' 
                    viewBox='0 0 24 24' 
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path 
                      strokeLinecap='round' 
                      strokeLinejoin='round' 
                      strokeWidth={1.5} 
                      d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' 
                    />
                    <path 
                      strokeLinecap='round' 
                      strokeLinejoin='round' 
                      strokeWidth={1.5} 
                      d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
                    />
                  </svg>
                </div>
                <p className='text-gray-400 font-normal'>
                  Run your code to see the results here
                </p>
                <p className='text-gray-500 text-xs mt-2'>
                  Press <kbd className='px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 border border-gray-600'>Ctrl</kbd> + <kbd className='px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 border border-gray-600'>Enter</kbd> to run
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OutputPanel;