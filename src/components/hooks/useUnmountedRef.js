/**
 * 获取当前组件是否已经卸载的 hook
 * 用于避免因组件卸载后更新状态而导致的内存泄漏
 */
import {useRef, useEffect} from 'react';

const useUnmountedRef = () => {
  const unmountedRef = useRef(false);
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  return unmountedRef;
};

export default useUnmountedRef;
