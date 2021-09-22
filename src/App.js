import '../src/App.css';
import Appointment from './Containers/Appointment/Appointment';
import Home from './Containers/Home/Home';
import AppointmentSingle from './Containers/AppointmentSingle/AppointmentSingle';
import GoBack from './Components/UI/GoBack/GoBack';
import Bank from './Containers/Bank/Bank';

import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom'


function App() {
  return (
    <Router>
      <div className="App">
        <ul>
          <li><Link to="/">Home page</Link></li>
          <li><Link to="/appointments">Appointments</Link></li>
          <li><Link to="/banks">Banks</Link></li>
        </ul>

          <Switch>
            <Route path="/appointments/:id" component={AppointmentSingle} />
            <Route path="/appointments" component={Appointment}/>
            <Route path="/banks" component={Bank} />
            <Route path="/" component={Home}/>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
