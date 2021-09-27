import '../src/App.css';
import Appointment from './Containers/Appointment/Appointment';
import Home from './Containers/Home/Home';
import AppointmentSingle from './Containers/AppointmentSingle/AppointmentSingle';
import GoBack from './Components/UI/GoBack/GoBack';
import Bank from './Containers/Bank/Bank';
import Navbar from './Components/UI/Navbar/Navbar';
import SignIn from './Components/Auth/SignIn/SignIn';
import Layout from './Containers/Layout/Layout';

import { AuthProvider } from './contexts/AuthContext';

import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom'

import MyDropzone from './Components/Upload/Inventory';

function App() {
  return (
    <Router>
          <AuthProvider>
              {console.log(process.env.REACT_APP_CLOUD_FUNCTIONS_URL)}
              <Switch>
                <Route path="/signin" component={SignIn} />
                <Route component={Layout}/>
              </Switch>
          </AuthProvider>
    </Router>
  );
}

export default App;
