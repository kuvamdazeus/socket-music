import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import store from "../redux/store";
import jwt from 'jsonwebtoken';
import Navbar from '../components/Navbar';
import  MessageContainer from '../components/MessageContainer';
import Sidebar from '../components/Sidebar.jsx';
import { Input, Button } from 'semantic-ui-react';
import { saveChat, resetChats, saveRoomId } from "../redux/actions";

export default function Room() {

    const socket = io(`${process.env.REACT_APP_BE}/chat-room`);

    const [userData, setUserData] = useState('');
    const [chats, setChats] = useState([]);
    const [waitingList, setWaitingList] = useState([]);

    const [message, setMessage] = useState('');
    const [onWait, setOnWait] = useState(false);

    useEffect(() => {
        setUserData(store.getState().user);
        saveRoomId(window.location.href.split('/room/')[1].trim());

        let unsubscribe = store.subscribe(() => {
            setUserData(store.getState().user);
            setChats(store.getState().chats);
            
        });

        socket.on('connect', () => {
            let postData = { ...store.getState().user, roomId: store.getState().roomId };

            socket.emit('want-to-join', jwt.sign(postData, process.env.REACT_APP_SOCKET_AUTH));
            setOnWait(true);
        });

        socket.on('disconnect', () => {
            console.log('Server disconnected');
        });

        socket.on('message-recieve', msgData => {
            saveChat(msgData);
        });

        socket.on('new-joinee', joineeData => {
            // Remove when someone joins with matching email
            console.log('In waiting\n', joineeData);

            setWaitingList([...waitingList, joineeData]);
        });

        socket.on('permitted', () => {
            setOnWait(false);
        });

        socket.on('members-update', room => {
            console.log(room);
        });

        socket.on('user-joined', joineeData => {
            setWaitingList(waitingList.filter(waitingUser => waitingUser.email !== joineeData.email));
        });

        return () => {
            let postData = { ...store.getState().user, roomId: store.getState().roomId };
            socket.emit('user-left', jwt.sign(postData, process.env.REACT_APP_SOCKET_AUTH));
            socket.disconnect();
            unsubscribe();
            resetChats();
        }

    }, []);

    const handleSendMessage = e => {
        e.preventDefault();
        let msg = {
            roomId: window.location.href.split('/room/')[1].trim(),
            sender: userData,
            message: { sent: Date.now(), text: message.trim() }
        }

        socket.emit('new-message', jwt.sign(msg, process.env.REACT_APP_SOCKET_AUTH));
        setMessage('');
    }

    const allowJoinee = (joineeData) => {
        socket.emit('permit', jwt.sign(joineeData, process.env.REACT_APP_SOCKET_AUTH));
    }

    return (
        <>
            <section className='bg-purple-100 min-h-screen'>
                <Navbar socket={socket} />
                
                <section className='px-5 sm:px-16'>

                    {waitingList.map(joinee => 
                        <section className='border rounded-md p-3 mb-1 flex justify-between'>
                            <p className='sm:text-2xl text-gray-500'>{`${joinee.email}`}</p>
                            <Button 
                                style={{
                                    backgroundColor: 'lightgreen', 
                                    height: 35, width: 70, padding: 5
                                }}
                                onClick={() => allowJoinee(joinee)}
                            >
                                Permit
                            </Button>
                        </section>
                    )}
                    
                    {chats.map(chat => 
                        <MessageContainer message={chat} 
                            isUser={chat.sender.email === userData.email} />
                    )}
                
                </section>
            </section>

            <div className='sticky bottom-0 w-screen bg-white p-1'>
                <form onSubmit={handleSendMessage}>
                    <Input onChange={e => setMessage(e.target.value)} 
                        style={{width: '100%'}} disabled={onWait} 
                        value={message} 
                        placeholder={onWait ? 'Waiting for permission from room members' : 'Enter message'} />
                </form>
            </div>

            <Sidebar />
        </>
    );
}