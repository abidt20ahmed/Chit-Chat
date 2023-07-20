// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { IoSend } from 'react-icons/io5';
import { AuthContext } from './context/AuthProvider';
import { AiOutlineBold, AiOutlineItalic, AiOutlineStrikethrough } from 'react-icons/ai';
import { BiCodeAlt, BiLink } from 'react-icons/bi';
import { GoListOrdered, GoListUnordered, GoQuote } from 'react-icons/go';
import { PiCodeBlockBold } from 'react-icons/pi';
import { CiFaceSmile } from 'react-icons/ci';
import { BsPlus } from 'react-icons/bs';
import { HiOutlineAtSymbol } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3001'); // Replace with your server URL

function App() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigate = useNavigate();
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [strike, setStrike] = useState(false);
  const [link, setLink] = useState(false);
  const [userInput, setUserInput] = useState('');
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    console.log('useEffect called');
    setLoading(true);
    socket.on('load messages', (messages) => {
      setMessages(messages);
    });
    
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    return () => {
      socket.off('load messages');
      socket.off('message');
      setLoading(false);
      console.log(messages);
    };
  }, [messages, loading]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
    }
    
    const styles = [];
    if (bold) {
      styles.push('font-bold');
    }
    if (italic) {
      styles.push('italic');
    }
    if (strike) {
      styles.push('line-through');
    }
    
    if (inputMessage.trim() !== '') {
      socket.emit('message', {
        picture: user?.photoURL,
        link: userInput,
        user: user?.displayName,
        style: styles,
        email: user?.email,
        text: inputMessage,
      });
      setInputMessage('');
    }
    setLoading(!loading)
    console.log(bold);
  };
  
  
  
  const handleConfirm =()=>{
    setLink(!link)
    const inputValue = window.prompt('Enter your input:');
    if (inputValue !== null) {
      setUserInput(inputValue);
    }
  }
  
  return (
    <div>
    {/* Render the chat messages */}
    <div className='mb-96'>
    {loading && messages &&
      messages.map((message, index) => (
        <div key={index} className={`lg:w-1/2 mx-auto my-3 text-gray-300 flex ${user?.email === message.email && 'flex-row-reverse'} gap-2 items-end`}>
        <img
        className='h-9 w-9 object-center object-cover rounded-full'
        title={message.user}
            src={message?.picture ? message?.picture : 'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png'}
        alt='user'
        />
          <a className={`${message?.link ? 'underline text-blue-600' : 'cursor-text'}`} href={message?.link ? message.link : userInput}><p className={`bg-slate-600 py-1 px-3 rounded-xl  ${user?.email === message.email ? 'rounded-br-none' : 'rounded-bl-none'} ${message.style && message.style.join(' ')} break-all`}>
            {message.text}
          </p></a>  
        </div>
        ))}
        </div>
        
        <form className="bg-gray-900 fixed w-full bottom-5" onSubmit={sendMessage}>
        <div className="border-solid border border-gray-300 rounded-md py-6 pb-8 lg:w-1/2 mx-auto relative">
        <input
        className="rounded-lg py-4 w-full bg-transparent text-gray-400 border-none focus:outline-none focus:ring-0"
        placeholder="Write your message here..."
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        />
        
        <div className='flex gap-4 items-center text-gray-300 font-bold text-2xl absolute top-1 left-2'>
        <span className={`${bold && 'text-gray-500'}`} onClick={() => setBold(!bold)}><AiOutlineBold /></span>
        <span className={`${italic && 'text-gray-500'}`} onClick={() => setItalic(!italic)} ><AiOutlineItalic /></span>
        <div className='flex gap-2 items-center'>
        <span className={`${strike && 'text-gray-500'}`} onClick={() => setStrike(!strike)} ><AiOutlineStrikethrough /></span>
        <span className={`border-x px-2 ${link && 'text-gray-500'}`} title={userInput} onClick={handleConfirm}><BiLink /></span>
        <span ><GoListOrdered /></span>
        <span ><GoListUnordered /></span>
        <span className=' border-x px-2'><GoQuote /></span>
        <span><BiCodeAlt /></span>
        </div>
        <span ><PiCodeBlockBold /></span>
        </div>
        
        <div className='flex gap-4 items-center text-gray-300 font-bold text-2xl absolute bottom-1 left-2'>
        <span className=' bg-gray-700 p-1 rounded-full'><BsPlus /></span>
        <span className='border-l pl-3'><CiFaceSmile /></span>
        <span className=' font-thin'><HiOutlineAtSymbol /></span>
        </div>
        
        <button className="text-blue-400 absolute bottom-2 right-2" type="submit">
        <IoSend className="h-8 w-14 text-white text-left py-2 pr-4 rounded-md bg-[#007A5A]" />
        </button>
        </div>
        </form>
        </div>
        );
      }
      
export default App;