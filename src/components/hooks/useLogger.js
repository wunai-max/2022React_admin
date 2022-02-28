/**
 * 在组件经历生命周期时登录控制台
 */
import useEffectOnce from './useEffectOnce';
import useUpdateEffect from './useUpdateEffect';

const useLogger = (componentName, ...rest) => {
  useEffectOnce(() => {
    __DEV__ && console.log(`${componentName} mounted`, ...rest);
    return () => __DEV__ && console.log(`${componentName} unmounted`);
  });

  useUpdateEffect(() => {
    __DEV__ && console.log(`${componentName} updated`, ...rest);
  });
};

export default useLogger;
