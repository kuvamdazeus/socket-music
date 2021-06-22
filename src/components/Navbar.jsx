import { useHistory } from 'react-router-dom';
import toggleSidebar from '../redux/actions';

export default function Navbar({ socket }) {

    const history = useHistory();

    const handleLeaveRoom = () => {
        history.push('/');
    }

    const handleMemberSidebar = e => {
        toggleSidebar(true);
    }

    return (
        <section className='shadow-md sticky top-0 z-10 bg-indigo-100 p-2 flex justify-between mb-14'>
            <div></div>

            <div className='flex'>
                <p 
                    className='text-lg cursor-pointer hover:text-red-500 -mb-0 mx-1 sm:mx-5'
                    onClick={handleLeaveRoom}
                >
                    Leave room
                </p>
                
                <p 
                    className='text-lg cursor-pointer hover:text-green-500 -mb-0 mx-1 sm:mx-5'
                    onClick={handleMemberSidebar}
                >
                    Participants
                </p>
            </div>
        </section>
    );
}