import './test.css'
import { useEffect, useState } from "react"

const Test = () => {

    const [innerText, setInnerText] = useState("...")
    const serverAddress = 'ws://localhost:8080'
    const [ws, setWS] = useState(null)

    const TEST_ROOM = 'TEST_ROOM'

    const testFunc = () => {
        ws.send(JSON.stringify({
            action: 'TEST',
            data: [
                {'test': 'test'},
                {'test': 'test'},
                {'test': 'test'}
            ]
        }))
    }

    useEffect(() => {
        
        const initiate_WS = async () => {
        if(ws === null) {
            // retrieve data from the server 
            setWS(new WebSocket(serverAddress))
            return
        } 

        console.log('Connecting to the server...')

        ws.onopen = () => {
            console.log('Connected to the server');
            ws.send(JSON.stringify({
                action: 'join_project',
                data: {
                    roomID: TEST_ROOM
                }
            }))
        };

        ws.onclose = (e) => {
            console.log('Connection closed')
        }

        ws.onmessage = async (e) => {
            try {
                const data = JSON.parse(e.data)
                console.log(data)
            } catch (error) {
                console.error('Error:', error)
            }
        }

        ws.onerror = (e) => {
            console.error('Error:', e)
        }
        }
        initiate_WS()
        
    },[ws])
    const changeInner = (e) => {
        const innerDiv = document.querySelector('.test1')
        innerDiv.innerHTML = e.target.value
    }

    return (
        <div className="App" onClick={testFunc}>
        
            <div className="test1">

            </div>

            <textarea className="test2" onChange={changeInner}>
                {innerText}
            </textarea>

        </div>
    )
}

export default Test