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

    // Update the innerHTML of the div
    const updateHTML = (html) => {
        // THIS IS A TEST
        const innerDiv = document.querySelector('.test1')
        innerDiv.innerHTML = html
    }

    const updateCSS = (css) => {

    }

    const sendWS = (message) => {
        try {
            if(ws === null) {
                console.log('Websocket is not connected')
                return
            }
            ws.send(JSON.stringify(message))
        } catch (error) {
            console.error('Error:', error)
        }
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
                const action = data.action
                switch(action){
                    case 'Welcome':
                        // console.log(data)
                        break
                    case 'updateHTML':
                        const html = data.data.html
                        updateHTML(html)
                        break
                }
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
        // find textfield selectionstart and selectionend
        const selectionStart = e.target.selectionStart
        const selectionEnd = e.target.selectionEnd
        console.log(selectionStart, selectionEnd)

        const html = e.target.value
        updateHTML(html)
        
        sendWS({
            action: 'updateHTML',
            data: {
                html
            }
        })
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