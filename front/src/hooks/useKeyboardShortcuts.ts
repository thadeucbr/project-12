import { useEffect } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onClear?: () => void;
  onHistory?: () => void;
  onThemeToggle?: () => void;
  onSurpriseMe?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, key, shiftKey } = event;
      const isModPressed = ctrlKey || metaKey;

      if (isModPressed) {
        switch (key) {
          case 's':
            event.preventDefault();
            handlers.onSave?.();
            break;
          case 'k':
            event.preventDefault();
            handlers.onClear?.();
            break;
          case 'h':
            if (shiftKey) {
              event.preventDefault();
              handlers.onHistory?.();
            }
            break;
          case 't':
            if (shiftKey) {
              event.preventDefault();
              handlers.onThemeToggle?.();
            }
            break;
          case 'r':
            if (shiftKey) {
              event.preventDefault();
              handlers.onSurpriseMe?.();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};