import '../src/App.css';
import SignIn from './Components/Auth/SignIn/SignIn';
import Layout from './Containers/Layout/Layout';

import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';


import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'

function App() {
  return (
    <Router>
          <AuthProvider>
              <div>
                <Toaster/>
              </div>
              
              <Switch>
                <Route path="/signin" component={SignIn} />
                <Route component={Layout}/>
              </Switch>
          </AuthProvider>
    </Router>
  );
}

export default App;
