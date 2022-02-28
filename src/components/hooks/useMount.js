/**
 * 只在组件 mount 时执行
 */
import useEffectOnce from './useEffectOnce';

const useMount = fn => {
  useEffectOnce(() => {
    fn();
  });
};

export default useMount;
