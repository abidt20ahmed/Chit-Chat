// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoSend } from 'react-icons/io5';

const socket = io('http://localhost:3001'); // Replace with your server URL

function App() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        socket.on('load messages', (messages) => {
            console.log(messages);
            setMessages(messages);
        });

        socket.on('message', (message) => {
            console.log(message);
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log(messages);
        });

        return () => {
            socket.off('load messages');
            socket.off('message');
        };
    }, [messages]);


    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() !== '') {
            socket.emit('message', inputMessage);
            setInputMessage('');
        }
    };
    console.log(messages);
    return (
        <div>
            {/* Render the chat messages */}
            {messages.map((message, index) => (
                <div key={index}>{message}</div>
            ))}

            <form className="bg-gray-00 absolute w-full bottom-5" onSubmit={sendMessage}>
                <div className="border-solid border border-gray-300 rounded-md p-4 w-1/2 mx-auto relative">
                    <input
                        className="rounded-lg p-4 w-full bg-transparent text-gray-400 focus:outline-none focus:ring-0"
                        placeholder="Write your message here..."
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button className="text-blue-400 absolute bottom-2 right-2" type="submit">
                        <IoSend className="h-8 w-14 text-white text-left py-2 pr-4 rounded-md bg-[#007A5A]" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default App;