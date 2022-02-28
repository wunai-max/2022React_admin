/**
 * 强制组件重新渲染的 hook
 */
import {useReducer} from 'react';

const updateReducer = num => (num + 1) % 1000000;

const useUpdate = () => {
  const [, update] = useReducer(updateReducer, 0);
  return update;
};

export default useUpdate;
