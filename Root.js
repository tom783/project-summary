import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import App from 'components/App';
import store from 'store';
class Root extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    );
  }
}
export default Root;



// NOTE: not used
// import { PersistGate } from 'redux-persist/integration/react';
// const { store, persistor } = configureStore;
{/* <PersistGate loading={null} persistor={persistor}> */}
{/* </PersistGate> */}