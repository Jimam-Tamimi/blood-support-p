import { createContext, useEffect, useState } from "react"


export const ConfigContext = createContext()

const DesignConfig = (props) => {
    let darkMd = localStorage.getItem('darkMode') 
    const [darkMode, setDarkMode] = useState(darkMd == null?true:JSON.parse(darkMd) ) 
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])


    let width = window.innerWidth

    const [show, setShow] = useState(width <= 748? false: true)
    const [smallDevice, setSmallDevice] = useState(width <= 748? true: false)


    return (
        <ConfigContext.Provider value={{darkMode, setDarkMode, show, setShow, smallDevice, setSmallDevice}} >
            {props.children}
        </ConfigContext.Provider>

    )
}

export default DesignConfig