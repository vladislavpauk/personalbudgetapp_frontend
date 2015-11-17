import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger'
import reducer from '../reducer';
import api from '../middlewares/api';

import DevTools from '../components/DevTools';

const logger = createLogger({
  transformer: (state) => {
    return state.toJS();
  }
});

const finalCreateStore = compose(
  applyMiddleware(thunk, api, logger),
  DevTools.instrument()
)(createStore);

export default function configureStore() {
  const store = finalCreateStore(reducer);
  return store;
}