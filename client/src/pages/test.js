import './test.css'
import { useEffect, useState } from "react"

const Test = () => {

    const [innerText, setInnerText] = useState("...")

    const changeInner = (e) => {
        const innerDiv = document.querySelector('.test1')
        innerDiv.innerHTML = e.target.value
    }

    return (
        <div className="App">
        
            <div className="test1">

            </div>

            <textarea className="test2" onChange={changeInner}>
                {innerText}
            </textarea>

        </div>
    )
}

export default Test