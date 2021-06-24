import GoogleLogin from 'react-google-login';
import swal from 'sweetalert';
import jwt from 'jsonwebtoken';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import store from '../redux/store.js';
import { userLoggedIn } from '../redux/actions.js';

export default function Login() {

    const history = useHistory();

    useEffect(() => {
        if (store.getState().user && localStorage.getItem('socket-music')) {
            history.push('/dashboard');
        }
        let unsubscribe = store.subscribe(() => {
            if (store.getState().user) {
                history.push('/dashboard');
            }
        });

        return () => unsubscribe();

    }, []);

    const handleGoogleLogin = response => {
        let loginData = {
            name: response.profileObj.name,
            email: response.profileObj.email,
            image: response.profileObj.imageUrl
        };
        
        localStorage.setItem('socket-music', jwt.sign(loginData, process.env.REACT_APP_JWT_SECRET));
        userLoggedIn(loginData);
        history.push('/dashboard');
    }

    return (
        <section className='h-screen flex justify-center items-center'>
            <GoogleLogin
                clientId={process.env.REACT_APP_GID}
                buttonText="Sign in with Google"
                onSuccess={handleGoogleLogin}
                onFailure={() => swal({ title: 'Error', text: 'Difficulty logging in, please try again later' })}
                cookiePolicy={'single_host_origin'}
            />
        </section>
    );
}