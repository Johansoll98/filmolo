import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function CustomScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    // Переключаем scrollRestoration в режим manual
    window.history.scrollRestoration = 'manual';
    
    // Получаем сохранённую позицию для текущего пути
    const savedPosition = sessionStorage.getItem(`scroll-${location.pathname}`);
    if (savedPosition) {
      // Небольшая задержка для того, чтобы контент успел отрендериться
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 100);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {  
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return null;
}

export default CustomScrollRestoration;
