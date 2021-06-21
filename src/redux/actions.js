import store from './store.js';
import * as types from './types.js';

export function userLoggedIn(user) {
    store.dispatch({ type: types.updateState, update: { ...store.getState(), user } });
    console.log(store.getState());
}

export function saveChat(msgData) {
    store.dispatch({ type: types.updateState, update: {
        ...store.getState(),
        chats: [...store.getState().chats, msgData]
    }});
    console.log('Saved chats on local device')
}

export function resetChats() {
    store.dispatch({ type: types.updateState, update: {
        ...store.getState(),
        chats: [],
        roomId: ''
    }});
    console.log('Don\'t worry buddy, your chats were deleted ;)');
}

export function saveRoomId(roomId) {
    store.dispatch({ type: types.updateState, update: {
        ...store.getState(),
        roomId,
    }});
}

export default function toggleSidebar(value) {
    store.dispatch({ type: types.updateState, update: { ...store.getState(), sidebarActive: value } });
}