import { useEffect, useState } from 'react';

import { isBrowser } from 'shared/lib/browser/is_browser';

interface Props {
  scrollPositionThreshold: number;
}

/**
 * Для сценариев логики, когда необходимо определить на основе скрол позиции
 * находится ли юзер ниже указанной позиции
 */
export const useBelowViewPosition = ({ scrollPositionThreshold }: Props) => {
  const [isVisible, setVisibleStatus] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!isBrowser) {
        return null;
      }

      setVisibleStatus(scrollPositionThreshold < window.scrollY);
    };

    document.addEventListener('scroll', onScroll);

    return () => document.removeEventListener('scroll', onScroll);
  }, [scrollPositionThreshold]);

  return { isVisible, setVisibleStatus };
};
