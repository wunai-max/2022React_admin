/**
 * 一个只在依赖更新时执行的 useEffect hook
 */
import {useEffect} from 'react';
import useFirstMountState from './useFirstMountState';

const useUpdateEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
