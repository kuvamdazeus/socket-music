import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import store from "../redux/store";
import jwt from 'jsonwebtoken';
import Navbar from '../components/Navbar';
import  MessageContainer from '../components/MessageContainer';
import { Input, Button, Icon } from 'semantic-ui-react';
import { saveChat, resetChats, saveRoomId } from "../redux/actions";
import ReactPlayer from 'react-player';
import { animateScroll } from 'react-scroll';
import { Sidebar } from 'semantic-ui-react';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

export default function Room() {

    const history = useHistory();
    const socket = io(`${process.env.REACT_APP_BE}/chat-room`);

    const [userData, setUserData] = useState('');
    const [chats, setChats] = useState([]);
    const [waitingList, setWaitingList] = useState([]);
    
    const [songUrl, setSongUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const [message, setMessage] = useState('');
    const [onWait, setOnWait] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('socket-music')) {
            swal({ title: 'Error', text: 'Please login with your google id to join this room', icon: 'error' })
            .then(() => history.push('/'));
        }

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

        socket.on('stream-started', result => {
            setIsPlaying(true);
            setSongUrl(result.link);
        });

        socket.on('stream-paused', () => {
            setIsPlaying(false);
        });

        return () => {
            let postData = { ...store.getState().user, roomId: store.getState().roomId };
            socket.emit('user-left', jwt.sign(postData, process.env.REACT_APP_SOCKET_AUTH));
            socket.disconnect();
            unsubscribe();
            resetChats();
        }

    }, []);

    useEffect(() => {
        animateScroll.scrollToBottom();

    }, [chats]);

    const handleSendMessage = e => {
        e.preventDefault();
        console.log(message.length);

        let msg = {
            roomId: window.location.href.split('/room/')[1].trim(),
            sender: userData,
            message: { sent: Date.now(), text: message.trim() }
        }

        if (message.trim().startsWith('{') && message.trim().endsWith('}')) {
            if (message.match(/play (.+)/)) {
                let streamData = { roomId: store.getState().roomId, searchWords: message.match(/play (.+)/)[1] };

                socket.emit('start-stream', jwt.sign(streamData, process.env.REACT_APP_SOCKET_AUTH));
            
            }
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
                    
                    {chats.map(chat => 
                        <MessageContainer message={chat} 
                            isUser={chat.sender.email === userData.email} />
                    )}

                    {waitingList.map(joinee => 
                        <section className='border rounded-md p-3 mb-1 flex justify-between'>
                            <p className='sm:text-2xl text-gray-500 -mb-2'>{`${joinee.email}`}</p>
                            <Button 
                                style={{
                                    backgroundColor: 'lightgreen', 
                                    height: 35, width: 70, padding: 5,
                                    marginBottom: -2
                                }}
                                onClick={() => allowJoinee(joinee)}
                            >
                                Permit
                            </Button>
                        </section>
                    )}
                
                </section>
            </section>

            <div className='sticky bottom-0 w-screen bg-white p-1 flex'>
                <form className='w-screen' onSubmit={handleSendMessage}>
                    <Input onChange={e => setMessage(e.target.value)} 
                        style={{width: '100%'}} disabled={onWait} 
                        value={message} 
                        placeholder={onWait ? 'Waiting for permission from room members' : 'Enter message'} 
                    />
                </form>

                <div className='flex justify-center items-center ml-2 pt-1'>
                    <Icon 
                        style={{fontSize: 22, color: 'gray', cursor: 'pointer'}} name='video play'
                        onClick={() => {
                            setShowVideo(true);
                        }}
                    />
                </div>
            </div>

            <Sidebar
                className='flex justify-center items-center'
                as='div'
                animation='overlay'
                icon='labeled'
                inverted
                visible={showVideo}
                onHide={() => setShowVideo(false)}
            >
                {isPlaying ? 
                    <ReactPlayer 
                        url={songUrl} playing={isPlaying} 
                        controls={true}
                        width='100%'
                        height='100%'
                    />
                :
                    <h1>No Song playing</h1>
                }
            </Sidebar>
        </>
    );
}