import { Accessor, createEffect, onCleanup, Setter } from 'solid-js';
import { isModalOpen } from '../components/Modal';

export function closeOnEscapeKeyDown(isOpen: Accessor<boolean>, setIsOpen: Setter<boolean>) {
  const handleEscapeKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen() && !isModalOpen()) {
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
