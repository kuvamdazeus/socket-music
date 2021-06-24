import { useHistory } from 'react-router-dom';

export default function Navbar() {

    const history = useHistory();

    const handleLeaveRoom = () => {
        history.push('/');
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
            </div>
        </section>
    );
}