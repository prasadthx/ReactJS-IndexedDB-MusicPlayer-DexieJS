import React, {useEffect, useRef, useState} from "react";
import {FaPause, FaPlay} from "react-icons/fa";
import './Player.css';
import {ImVolumeDecrease, ImVolumeIncrease} from "react-icons/im";
import image from '../assets/image.jpg'

const Player = ({audioFile, metadata, db} : any) => {
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const seekSlider = useRef<any>(null);
    const volumeSlider = useRef<any>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect( () => {
        if(audioPlayer.current !== null){
            if (audioPlayer.current.readyState > 0) {
                setDuration((audioPlayer.current.duration));
                if(seekSlider.current !== null){
                    seekSlider.current.max = Math.floor(duration);
                }
            }
            else {
                audioPlayer.current.addEventListener('loadedmetadata', () => {
                    // @ts-ignore
                    setDuration(audioPlayer.current.duration);
                    seekSlider.current.max = Math.floor(duration);
                });
            }
        }
    }, [audioPlayer.current])

    useEffect( () => {
        if (seekSlider.current !== null){
            seekSlider.current.addEventListener('input', () => {
                setCurrentTime(seekSlider.current.value);
            })
        }
    }, [seekSlider.current])

    useEffect( () => {
        if (seekSlider.current !== null){
            if (audioPlayer.current !== null){
                seekSlider.current.addEventListener('change', () => {
                    // @ts-ignore
                    audioPlayer.current.currentTime = seekSlider.current.value;
                });
                audioPlayer.current.addEventListener('timeupdate', () => {
                    // @ts-ignore
                    seekSlider.current.value = Math.floor(audioPlayer.current.currentTime);
                    setCurrentTime(seekSlider.current.value);
                });
                if(volumeSlider !== null){
                    volumeSlider.current.addEventListener('input', () => {
                        //@ts-ignore
                        audioPlayer.current.volume = volumeSlider.current.value;
                    })
                }
            }
        }
    }, [audioPlayer.current, seekSlider.current, volumeSlider.current])

    return (
        <div className={"w-full h-full flex justify-center items-center flex-col dark:text-white"}>
            <div className={"w-4/5 md:w-1/5"}>
                <img src={metadata.picture !== undefined ? getImage(metadata.picture) : image} className={"rounded-full mx-auto"}/>
            </div>
            <div className={"text-2xl font-bold my-8 mt-12 md:my-12 text-center"}>
                {metadata.title}
            </div>
            <div className={"audio p-4"}>
                <audio id={"audio-player"} preload={"metadata"} ref={audioPlayer}>
                    <source src={audioFile} type="audio/mpeg"/>
                            Your browser does not support the audio tag.
                </audio>
                <div className={"flex flex-col w-full"}>
                    <div className={"w-full flex"}>
                        <span>{calculateTime(currentTime)}</span>
                        <input type={"range"} max={100} ref={seekSlider} defaultValue={0} className={"w-full mx-3"}/>
                        <span>{calculateTime(duration)}</span>
                    </div>
                    <div className={"flex my-4"}>
                        <ImVolumeDecrease/>
                        <input type="range" ref={volumeSlider} step={0.05} min={0} max={1}
                                className={"w-full mx-3"}/>
                        <ImVolumeIncrease/>
                    </div>
                    <div className={"flex justify-center items-center mt-2"}>
                        {isPlaying ? (
                            <FaPause onClick={() => { stopAudio(audioPlayer.current); setIsPlaying(false) }} className={"cursor-pointer"}/>
                        ) : (
                            <FaPlay onClick={() => { playAudio(audioPlayer.current); setIsPlaying(true) }} className={"cursor-pointer"}/>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center text-white">
                <button className={"bg-red-700 p-2 rounded-full mt-3"} onClick={() => {db.table('audio').clear(); db.table('file').clear()}}>
                    Clear Song
                </button>
            </div>
        </div>
    )
}

export default Player;

const playAudio = (player : any) => {
    player.play();
}

const stopAudio = (player : any) => {
    player.pause();
}

const calculateTime = (secs : any) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const getImage = (imageData : any) => {
    const { data, format } = imageData;
    let base64String = "";
    for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
    }
    return `data:${data.format};base64,${window.btoa(base64String)}`;
}

