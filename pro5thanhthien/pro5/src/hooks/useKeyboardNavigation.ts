import { useEffect } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';

/**
 * Global Keyboard Navigation Hook
 * - [1]: Home section & Camera transition
 * - [2]: About section & Camera transition
 * - [3]: Projects section & Camera transition
 * - [4]: Contact section & Camera transition
 * - [H] / [h]: Toggle Free-look 3D Mode (Hide/Show UI overlay)
 * - [Esc]: Close active project modal
 *
 * Bỏ qua sự kiện khi người dùng đang nhập liệu trong input, textarea hoặc contentEditable.
 */
export function useKeyboardNavigation() {
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
  const toggleUiHidden = usePortfolioStore((s) => s.toggleUiHidden);
  const selectedProjectId = usePortfolioStore((s) => s.selectedProjectId);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Kiểm tra nếu con trỏ đang nằm trong ô nhập dữ liệu
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // 2. Phím Escape: đóng modal nếu đang mở
      if (e.key === 'Escape' && selectedProjectId) {
        setSelectedProject(null);
        return;
      }

      // 3. Phím số 1-4 và phím H
      switch (e.key) {
        case '1':
          setActiveSection('home');
          break;
        case '2':
          setActiveSection('about');
          break;
        case '3':
          setActiveSection('projects');
          break;
        case '4':
          setActiveSection('contact');
          break;
        case 'h':
        case 'H':
          toggleUiHidden();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveSection, toggleUiHidden, selectedProjectId, setSelectedProject]);
}
