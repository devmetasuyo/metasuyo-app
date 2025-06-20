"use client";

import { useEffect, useState } from 'react';
import { cleanupCustomElements } from '@/utils/customElementsCleanup';

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationBoundary({ children, fallback }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Limpiar custom elements conflictivos antes de la hidratación
    cleanupCustomElements();
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return fallback || (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#040200'
      }}>
        <div style={{ color: 'white' }}>Cargando...</div>
      </div>
    );
  }

  return <>{children}</>;
} 