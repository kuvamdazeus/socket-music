export default function MessageContainer({ message, isUser }) {
    return (
        <section className='flex justify-between'>
            {isUser && <div></div>}
            <div className={`bg-${isUser ? 'indigo-500' : 'white'} p-2 mb-2 overflow-x-scroll no-scrollbar`}>
                <p className={`text-xl text-${isUser ? 'white' : 'black'} max-w-screen-sm`}>{message.message.text}</p>
            </div>
        </section>
    );
}