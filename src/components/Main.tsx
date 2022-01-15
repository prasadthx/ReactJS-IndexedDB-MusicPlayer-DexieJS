import {BsUpload} from "react-icons/bs";
import Typewriter from "typewriter-effect";
import Dexie from "dexie";
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
        audio: 'audioFile, metadata',
        file : 'isFilePicked'
    })

    const isFilePicked = useLiveQuery(() => db.table("file").toArray(), [], []);
    const audioFileLoaded = useLiveQuery(() => db.table("audio").toArray(), [],[]);

    const changeHandler = async (event : React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files === null){
            return;
        }
        if(!audioTypes.includes(`${event.target!.files[0]!.type}`)){
            alert("Enter valid audio file");
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(event.target!.files[0]!);
        reader.onload = async (e) => {
            // @ts-ignore
            jsMediaTags.read(event.target!.files[0]!,{
                onSuccess: async function (tag: any) {
                    await db.table("file").add({
                        isFilePicked : 'true'
                    });
                    await db.table('audio').add({
                        audioFile: reader.result,
                        metadata: tag.tags
                    });
                },
                onError: async function (error: any) {
                    console.log(error);
                    await db.table("file").add({
                        isFilePicked : 'true'
                    });
                    await db.table('audio').add({
                        audioFile: reader.result,
                        metadata: ""
                    });
                }
            });
        }
    };

    if (audioFileLoaded.length > 0)
    {
        return (
            <div className={"w-full h-full"}>
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
                    {isFilePicked.length > 0 ? (
                        <div className={"dark:text-white"}>Loading...</div>
                    ) : (
                        <label className={"bg-blue-500 rounded-md p-2 flex items-center font-bold cursor-pointer"}>
                            <input type={"file"} className={"hidden"} name="file" accept=".mp3, .ogg, .wav" onChange={changeHandler} />
                            <div className={"mr-3"}>
                                <BsUpload/>
                            </div>
                            <div>Upload</div>
                        </label>
                    )}
                </div>
            </div>
        )
    }
}

export default Main;


