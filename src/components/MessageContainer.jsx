export default function MessageContainer({ message, isUser }) {
    if (!message.announcement) return (
        <section className='flex justify-between'>
            {isUser && <div></div>}
            
            <div className={`bg-${isUser ? 'indigo-500' : 'white'} p-2 mb-2 overflow-x-scroll no-scrollbar`}>
                <p className={`text-xs ${isUser ? 'text-white' : 'text-gray-400'}`}>{message.sender.name}</p>
                <p className={`text-xl text-${isUser ? 'white' : 'black'} max-w-screen-sm`}>{message.message.text}</p>
            </div>
        </section>
    );

    return (
        <section className='flex justify-center mb-3'>
            <div className='bg-white p-1 sm:p-2 text-center rounded-md shadow-lg'>
                <p className='sm:text-lg text-sm'><b>{message.announcement}</b></p>
            </div>
        </section>
    );
}