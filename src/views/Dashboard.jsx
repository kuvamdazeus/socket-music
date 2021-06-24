import store from '../redux/store.js';
import { Button, Divider, Modal, Input } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Dashboard() {

    const history = useHistory();

    const [userData, setUserData] = useState('');
    const [joinModal, setJoinModal] = useState(false);
    const [room, setRoom] = useState('');
    const [roomInputError, setRoomInputError] = useState(false);

    useEffect(() => {
        setUserData(store.getState().user);
        let unsubscribe = store.subscribe(() => {
            setUserData(store.getState().user);
        });

        return () => unsubscribe();

    }, []);

    const handleCreateRoom = () => {
        let roomId = Math.round(Math.random() * Math.pow(10, 10));
        history.push(`/room/${roomId}`);
    }

    const handleJoinRoom = () => {
        if (room.length !== 10) {
            setRoomInputError(true);
            setRoom('Invalid Id');
        
        } else {
            history.push(`/room/${room}`);

        }
    }

    return (
        <>
            <section className='min-h-screen bg-gray-50 flex justify-center items-center'>
                <div className='w-screen sm:w-2/3 p-5 text-center rounded-md'>
                    <p className='text-3xl sm:text-4xl'>Welcome, {userData && userData.name.split(' ')[0]}</p>
                    <Button
                        style={{backgroundColor: 'purple', color: 'white'}}
                        onClick={handleCreateRoom}
                    >
                        Create Room
                    </Button>
                </div>
            </section>

            <Modal
                size='small'
                open={joinModal}
                onClose={() => setJoinModal(false)}
            >
                <Modal.Header>Join Room</Modal.Header>
                
                <center><Modal.Content style={{padding: 20}}>
                    <Input style={{width: '100%'}} placeholder='Paste room link & enter' 
                        error={roomInputError} onChange={e => setRoom(e.target?.value?.trim(' '))} value={room} />
                </Modal.Content></center>
                
                <Modal.Actions>
                    <Button onClick={() => setJoinModal(false)}>
                        Cancel
                    </Button>
                    <Button positive onClick={handleJoinRoom}>
                        Join
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}