import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import reducers from '../reducers';

// import reducers from "../reducers";

const history = createBrowserHistory();

const routeMiddleware = routerMiddleware(history);

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    const { logger } = require('redux-logger');
    middleware.push(logger);
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers(history));

function configStore(initialState = {}) {
  const store = createStore(
    persistReducer,
    initialState,
    bindMiddleware([routeMiddleware, thunk.withExtraArgument(history)])
  );

  const persistor = persistStore(store);
  return { store, persistor };
}

export default configStore;
export { history };
