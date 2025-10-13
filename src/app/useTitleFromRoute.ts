import { useEffect } from 'react';
import { routes } from '../routes';
import { useNavigation } from './router';

export function useTitleFromRoute() {
  const { path } = useNavigation();
  useEffect(() => {
    const r = routes.find(r => r.path === path);
    if (r?.title) {
      document.title = r.title + ' — Minha Aplicação';
    } else {
      document.title = 'Minha Aplicação';
    }
  }, [path]);
}
