import {BsGithub} from "react-icons/bs";
import React, {useEffect, useState} from "react";
import {ImSun} from "react-icons/im";
import {FiMoon} from "react-icons/fi";

const InfoBar = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(()=>{
        document.documentElement.classList.add('dark')
    },[])

    return(
        <div className={"w-full flex justify-between text-2xl dark:text-white p-3 px-5"}>
            <div>
                <a href="https://github.com/prasadthx/ReactJS-IndexedDB-MusicPlayer-DexieJS"><BsGithub/></a>
            </div>
            <div className="cursor-pointer">
                {theme === "dark" ? <FiMoon onClick={()=>toggleTheme(theme, setTheme)}/>:<ImSun onClick={()=>toggleTheme(theme, setTheme)}/>}
            </div>
        </div>
    )
}

const toggleTheme = (theme:string, setTheme:React.Dispatch<React.SetStateAction<string>>) => {
    if(theme === "light"){
        document.documentElement.classList.add('dark')
        setTheme("dark");
        localStorage.setItem('theme','dark');
    }
    else{
        localStorage.setItem('theme','light');
        setTheme("light");
        document.documentElement.classList.remove('dark')
    }
}

export default InfoBar;
