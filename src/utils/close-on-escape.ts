import { Accessor, createEffect, onCleanup, Setter } from 'solid-js';

export function closeOnEscapeKeyDown(isOpen: Accessor<boolean>, setIsOpen: Setter<boolean>) {
  const handleEscapeKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) {
      setIsOpen(false);
    }
  };

  createEffect(() => {
    document.addEventListener('keydown', handleEscapeKeydown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleEscapeKeydown);
  });
}
