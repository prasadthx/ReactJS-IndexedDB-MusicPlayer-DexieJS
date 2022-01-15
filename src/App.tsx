import React from 'react';
import './App.css';
import InfoBar from "./components/InfoBar";
import Main from "./components/Main";

function App() {
  return (
    <div className="App overscroll-none dark:bg-black relative">
        <div className={"w-full h-full absolute"}>
            <Main/>
        </div>
        <div className={"absolute w-full"}>
            <InfoBar/>
        </div>
    </div>
  );
}

export default App;
