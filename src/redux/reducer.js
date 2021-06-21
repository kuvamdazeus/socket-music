import { updateState } from "./types";

let initialState = {
    user: {},
    chats: [],
    roomId: '',
    sidebarActive: false,
};

export default function reducer(state = initialState, action) {
    if (action.type === updateState) {
        return action.update;
    }

    else {
        return state;
    }

}