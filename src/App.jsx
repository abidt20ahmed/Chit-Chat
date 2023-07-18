// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoSend } from "react-icons/io5";

const socket = io('http://localhost:3001'); // Replace with your server URL

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const [load, setLoad] = useState(false)

  useEffect(() => {
    socket.on('load messages', (messages) => {
      console.log('Received messages:', messages);
      setMessages([...messages]);
      // setMessages(messages);
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => {
        const existingMessage = prevMessages.find((msg) => msg._id === message._id);
        if (existingMessage) {
          console.log('Duplicate message found:', message);
          return prevMessages; // Do not add the duplicate message
        }
        console.log('New message:', message);
        return [...prevMessages]; // Add the new message
      });
    });

    return () => {
      socket.off('load messages');
      socket.off('message');
    };
  }, []);


  const sendMessage = (e) => {
    e.preventDefault();
    console.log(messages);
    const chat = { user: 'random', text: message };

    if (message.trim() !== '') {
      socket.emit('message', chat);
      setMessage('');
      setMessages((prevMessages) => [...prevMessages, chat]); // Use spread operator to create a new array
    }
  };


  return (
    <div>

      {messages.map((message, index) => (
        <div key={index} className='rounded-md p-4 w-1/2 mx-auto relative text-gray-400'>
          {message.user}  {typeof message.text === 'string' && message.text}
        </div>
      ))}

      <form className=' bg-gray-00 absolute w-full bottom-5' onSubmit={sendMessage}>
        <div className='border-solid border border-gray-300 rounded-md p-4 w-1/2 mx-auto relative'>
          <input
            className=' rounded-lg p-4 w-full bg-transparent text-gray-400 focus:outline-none focus:ring-0'
            placeholder='Write your message here...'
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className='text-blue-400 absolute bottom-2 right-2' type="submit"><IoSend className='h-8 w-14 text-white text-left py-2 pr-4 rounded-md bg-[#007A5A]' /></button>
        </div>

      </form>
    </div>
  );
}

export default App;