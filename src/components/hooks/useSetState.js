/**
 * 管理 object 类型 state 的 Hooks
 * 用法与 class 组件的 this.setState 基本一致
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

const isFunction = obj => {
  return typeof obj === 'function';
};

const useSetState = initialState => {
  const [state, setState] = useState(initialState);

  let isUpdate = useRef();

  const setMergeState = useCallback((patch, cb) => {
    isUpdate.current = cb;
    setState(prevState => ({
      ...prevState,
      ...(isFunction(patch) ? patch(prevState) : patch),
    }));
  }, []);

  useEffect(() => {
    if (isUpdate.current) {
      isUpdate.current();
    }
  })

  return [state, setMergeState];
};

export default useSetState;