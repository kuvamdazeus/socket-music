import store from '../redux/store.js';
import { Sidebar } from 'semantic-ui-react';
import toggleSidebar from '../redux/actions.js';
import { useEffect, useState } from 'react';

export default function SidebarContainer() {

    const [visible, setVisible] = useState(store.getState().sidebarActive);

    useEffect(() => {
        let unsubscribe = store.subscribe(() => {
            setVisible(store.getState().sidebarActive);
        });
        
        return () => unsubscribe();

    }, []);

     return(
        <Sidebar
            className='p-5 z-20 bg-gray-100 text-center'
            as='div'
            animation='overlay'
            icon='labeled'
            inverted
            onHide={() => toggleSidebar(false)}
            visible={visible}
        >

            <p className='text-2xl'>Sidebar</p>

            <p>P1</p>
            <p>P2</p>
            <p>P3</p>
            <p>P4</p>
            <p>P5</p>

        </Sidebar>
     );
}