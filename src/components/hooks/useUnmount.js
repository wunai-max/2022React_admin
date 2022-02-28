/**
 * 只在组件 unmount 时执行的 hook
 */
import {useRef} from 'react';
import useEffectOnce from './useEffectOnce';

const useUnmount = fn => {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffectOnce(() => () => fnRef.current());
};

export default useUnmount;
