import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { userLoggedIn } from './redux/actions.js';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Room from './views/Room';

export default function App() {

    useEffect(() => {
        if (localStorage.getItem('socket-music')) {
            try {
                let user = jwt.verify(localStorage.getItem('socket-music'), process.env.REACT_APP_JWT_SECRET);
                userLoggedIn(user);
            
            } catch (err) {
                localStorage.removeItem('socket-music');
				console.log(err);

            }
        }

    }, []);

	return (
		<Router>
			<section className=''>
				
				<Switch>
					<Route exact path='/' component={Login} />
					<Route exact path='/dashboard' component={Dashboard} />
					<Route exact path='/room/:roomId' component={Room} />
				</Switch>
			</section>
		</Router>
	);
}
