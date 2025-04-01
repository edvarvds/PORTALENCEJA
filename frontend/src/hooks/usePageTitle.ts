import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - ENCCEJA 2025 | Portal do Aluno`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}; 