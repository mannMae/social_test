import { Provider } from 'react-redux';
import './App.css';
import GoogleButton from './GoogleButton';
import configStore from './redux/store';

export const { store, persistor } = configStore;

function App() {
  return (
    // <Provider store={store}>

    <GoogleButton />
    // </Provider>
  );
}

export default App;
