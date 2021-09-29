import '../src/App.css';
import SignIn from './Components/Auth/SignIn/SignIn';
import Layout from './Containers/Layout/Layout';

import { AuthProvider } from './contexts/AuthContext';

import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'

function App() {
  return (
    <Router>
          <AuthProvider>
              {console.log(process.env.REACT_APP_API_URL)}
              {console.log(process.env.NODE_ENV)}

              <Switch>
                <Route path="/signin" component={SignIn} />
                <Route component={Layout}/>
              </Switch>
          </AuthProvider>
    </Router>
  );
}

export default App;
