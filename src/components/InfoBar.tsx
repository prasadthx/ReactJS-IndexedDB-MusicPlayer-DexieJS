import {BsFillMoonFill, BsGithub, BsSunFill} from "react-icons/bs";
import React, {useState} from "react";

const InfoBar = () => {
    const [theme, setTheme] = useState("");

    return(
        <div className={"w-full flex justify-between text-2xl dark:text-white p-3 px-5"}>
            <div>
                <BsGithub/>
            </div>
            <div>
                {theme === "dark" ? <BsFillMoonFill onClick={()=>toggleTheme(theme, setTheme)}/>:<BsSunFill onClick={()=>toggleTheme(theme, setTheme)}/>}
            </div>
        </div>
    )
}

const toggleTheme = (theme:string, setTheme:React.Dispatch<React.SetStateAction<string>>) => {
    if(theme === "dark"){
        localStorage.pageTheme = "light";
        setTheme("light");
        document.documentElement.classList.remove('dark')
    }
    else{
        document.documentElement.classList.add('dark')
        setTheme("dark");
        localStorage.pageTheme = "dark";
    }
}

export default InfoBar;
