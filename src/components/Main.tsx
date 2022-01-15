import {BsUpload} from "react-icons/bs";
import Typewriter from "typewriter-effect";
import Dexie from "dexie";
// import * as jsmediatags from "jsmediatags";
import React, {useState} from "react";
import {useLiveQuery} from "dexie-react-hooks";
import Player from "./Player";

const jsMediaTags = window.jsmediatags;

const audioTypes = [
    "audio/mpeg",
    "audio/ogg",
    "audio/wav"
]
const Main = () => {
    const db = new Dexie('React-Audio');
    db.version(1).stores({
        audio: 'audioFile, metadata'
    })

    const [selectedFile, setSelectedFile] = useState<File>();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const audioFileLoaded = useLiveQuery(() => db.table("audio").toArray(), [],[]);

    const changeHandler = async (event : React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files === null){
            return;
        }
        if(!audioTypes.includes(`${event.target!.files[0]!.type}`)){
            alert("Enter valid audio file");
            return;
        }
        setSelectedFile(event.target!.files[0]!);
        let reader = new FileReader();
        reader.readAsDataURL(event.target!.files[0]!);
        reader.onload = async (e) => {
            // @ts-ignore
            jsMediaTags.read(event.target!.files[0]!,{
                onSuccess: async function (tag: any) {
                    await db.table('audio').add({
                        audioFile: reader.result,
                        metadata: tag.tags
                    });
                },
                onError: async function (error: any) {
                    console.log(error);
                    await db.table('audio').add({
                        audioFile: reader.result,
                        metadata: ""
                    });
                }
            });
        }
        //await db.table('audio').add({audioFile:`{file : ${event.target!.files[0]}}`});
        setIsFilePicked(true);
    };

    if (audioFileLoaded.length > 0)
    {
        return (
            <div className={"w-full h-full"}>
                {/*{console.log(audioFileLoaded[0])}*/}
                {/*<audio controls>*/}
                {/*    <source src={audioFileLoaded[0].audioFile} type="audio/mpeg"/>*/}
                {/*            Your browser does not support the audio tag.*/}
                {/*</audio>*/}
                <Player audioFile={audioFileLoaded[0].audioFile} metadata={audioFileLoaded[0].metadata} db={db}/>
            </div>
        )
    }
    else{
        return(
            <div className={"flex flex-col w-full h-full p-4 justify-evenly items-center"}>
                <div className={"dark:text-white text-5xl text-center"}>
                    <Typewriter
                        options={{cursor:"."}}
                        onInit={(typewriter)=> {
                            typewriter
                                .typeString("ReactJS IndexedDB Music Player")
                                .start();
                        }}
                    />
                </div>
                <div>
                    <label className={"bg-blue-500 rounded-md p-2 flex items-center font-bold cursor-pointer"}>
                        <input type={"file"} className={"hidden"} name="file" accept=".mp3, .ogg, .wav" onChange={changeHandler} />
                        <div className={"mr-3"}>
                            <BsUpload/>
                        </div>
                        <div>Upload</div>
                    </label>
                </div>
            </div>
        )
    }
}

export default Main;


