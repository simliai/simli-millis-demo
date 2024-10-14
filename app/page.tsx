"use client";
import React, { useState, useRef, use, useEffect } from "react";
import axios from "axios";
import { SimliClient } from "simli-client";
import Millis from "../@millisai/web-sdk";

const simli_faceid = "4145d354-fd78-4c29-b6b1-0663a04e8d7b"; // Put your Simli Face ID here
const millis_agentid = "-O99x7LT0ilzOhjEWbaL"; // Put your Millis Agent ID here

const simliClient = new SimliClient();
const msClient = Millis.createClient({
  publicKey: process.env.NEXT_PUBLIC_MILLIS_API_KEY,
});

const Demo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const audioChunkNumber = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (videoRef.current && audioRef.current) {
      // Step 0: Initialize Simli Client
      const SimliConfig = {
        apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY,
        faceID: simli_faceid,
        handleSilence: true,
        videoRef: videoRef,
        audioRef: audioRef,
      };

      simliClient.Initialize(SimliConfig);

      console.log("Simli Client initialized");
    }

    return () => {
      simliClient.close();
    };
  }, [videoRef, audioRef]);

  const handleStart = () => {
    // Step 1: Start Simli Client
    simliClient.start();
    setIsLoading(true);
  };

  // Simli cLient Event Listeners
  useEffect(() => {
    simliClient.on("connected", () => {
      console.log("SimliClient is now connected!");

      // Start Millis Client
      msClient.start(millis_agentid);
    });

    simliClient.on("disconnected", () => {
      console.log("SimliClient has disconnected!");
    });

    simliClient.on("failed", () => {
      console.log("SimliClient has failed to connect!");
    });
  }, []);

  // Millis Client Event Listeners
  useEffect(() => {
    msClient.on("onopen", () => {
      console.log("Millis: WebSocket connection opened.");
    });

    msClient.on("onready", () => {
      console.log("Millis: Client is ready.");

      // Change UI
      setIsActive(true);
      setIsLoading(false);
    });

    msClient.on("onsessionended", () => {
      console.log("Millis: Session ended.");
    });

    msClient.on("onaudio", (audio) => {
      // console.log("Millis: Audio received:", audio);

      // Millis Client repeats the audio chunks twice, so we take one and skip the other
      if (audioChunkNumber.current % 2 === 0) {
        console.warn(audio);
        simliClient.sendAudioData(audio);
      }

      audioChunkNumber.current++;
    });

    msClient.on("onresponsetext", (text, payload) => {
      // console.log("Millis: Response text:", text, "Payload:", payload);
    });

    msClient.on("ontranscript", (text, payload) => {
      console.log("Millis: Transcript:", text, "Payload:", payload);
    });

    msClient.on("analyzer", (analyzer) => {
      // console.log("Millis: Analyzer node:", analyzer);
    });

    msClient.on("useraudioready", (data) => {
      // console.log("Millis: User audio ready:", data);
    });

    msClient.on("onlatency", (latency) => {
      console.log("Millis: Latency:", latency);
    });

    msClient.on("onclose", (event) => {
      console.log("Millis: WebSocket connection closed:", event);
    });

    msClient.on("onerror", (error) => {
      console.error("Millis: WebSocket error:", error);
    });
  }, []);

  return (
    <div className="bg-black w-full h-svh flex flex-col justify-center items-center font-mono text-white">
      <div className="w-[512px] h-svh flex flex-col justify-center items-center gap-4">
        {/* Simli Client Renderer */}
        <div className="relative w-full aspect-video">
          <video
            ref={videoRef}
            id="simli_video"
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          ></video>
          <audio ref={audioRef} id="simli_audio" autoPlay></audio>
        </div>
        <button
          onClick={handleStart}
          className="w-full bg-white text-black py-2 px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        >
          {isActive ? "Stop" : isLoading ? "Loading..." : "Start"}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Demo;
