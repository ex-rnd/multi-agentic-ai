import axios from "axios";
import { useState } from "react"

const ChatPage = () => {

    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);
    const [chat, setChat] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChatSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);

    try {
        const res = await axios.post('http://localhost:5000/api/chat', 
            {message},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        
        
        );

        const data = res.data;

        if (data.reply) {
            setResponse(data.reply),
            setChat(true);
            setLoading(false),
            console.log(data.reply)
        }





    } catch (error) {
        console.error("Error :", error.message)
        
    }

    }





  return (
    <>

        <div className='chat'>
            <div className='flex flex-col justify-center items-center h-dvh'>
                <div className='border-2 rounded-2xl p-5'>
                    <form onSubmit={handleChatSubmit}>
                        <h1 className='font-bold text-4xl text-center mb-2'>
                            Chat Interface 
                        </h1>
                        <div className='flex flex-col'>
                            <label htmlFor='message'>
                                 Users Query: 
                            </label>
                            <textarea 
                                placeholder='Enter your query...'
                                value={message}
                                onChange={
                                    (e) => setMessage(e.target.value)
                                }
                                className='border-2 rounded-md mt-2'                            
                            />
                        </div>
                        <button
                            type='submit' 
                            className='mt-2 w-full border border-md rounded-md'  
                            disabled={loading}                      
                        >
                            { loading ? 'Submitting' : 'Submit' }
                        </button>
                    </form>
                    {chat && !loading && (
                        <div className="bg-amber-200">
                            {response}
                        </div>
                    ) }
                </div>
            </div>
        </div>

    </>
    
  )
}

export default ChatPage
