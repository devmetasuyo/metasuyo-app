// Utilidad para limpiar custom elements que pueden causar conflictos
export function cleanupCustomElements() {
  if (typeof window === 'undefined') return;

  // Lista de custom elements de WalletConnect que pueden causar conflictos
  const conflictingElements = [
    'wcm-button',
    'wcm-modal',
    'wcm-connect-button',
    'wcm-account-button',
    'wcm-network-button'
  ];

  conflictingElements.forEach(elementName => {
    try {
      // Si el elemento ya está definido, no podemos redefinirlo
      // Pero podemos intentar limpiarlo del DOM
      const existingElements = document.querySelectorAll(elementName);
      existingElements.forEach(element => {
        element.remove();
      });
    } catch (error) {
      console.warn(`Could not cleanup custom element ${elementName}:`, error);
    }
  });
}

// Función para verificar si hay conflictos de custom elements
export function checkCustomElementConflicts(): boolean {
  if (typeof window === 'undefined') return false;

  const conflictingElements = [
    'wcm-button',
    'wcm-modal',
    'wcm-connect-button'
  ];

  return conflictingElements.some(elementName => {
    return customElements.get(elementName) !== undefined;
  });
} 