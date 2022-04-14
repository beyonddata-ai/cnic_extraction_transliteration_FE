import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g import * as tfmodel from "@tensorflow-models/tfmodel";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
// 2. TODO - Import drawing utility here
import { drawRec } from "./utilities";
import html2canvas from "html2canvas";

const WebcamDetection = (props) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [cardDetected, setCardDetected] = useState(false);
  const [data, setData] = useState();

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const setBox = (obj) => {
    console.log("Updated 2: ", obj);
  };

  const download = (canvas, filename) => {
    console.log("props.shimg", props.shimg);
    if (
      props.chimg === null ||
      props.chimg === undefined ||
      props.chimg === ""
    ) {
      // create an "off-screen" anchor tag
      const a = document.createElement("a");

      // the key here is to set the download attribute of the a tag
      a.download = filename;

      // convert canvas content to data-uri for link. When download
      // attribute is set the content pointed to by link will be
      // pushed as "download" in HTML5 capable browsers
      a.href = canvas.toDataURL("image/png;base64");

      let temp = canvas.toDataURL("image/png;base64");

      console.log("temp", temp);

      props.setchimg(temp);

      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  //let element = document.getElementsByClassName("App-header");
  let element = document.getElementsByClassName("demo123");
  //let element = document.querySelector("canvas");
  //let element = document.querySelector("canvas");
  html2canvas(element[0]).then((canvas) => {
    download(canvas, "screenshot");
  });

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const obj = await net.detect(video);
      //console.log("New Object: ", obj);

      if (obj.length > 0 && obj[0].class === "cell phone") {
        setCardDetected(true);
        setData(obj[0]);
        setBox(obj[0]);

        // 5. TODO - Update drawing utility
        const ctx = canvasRef.current.getContext("2d");

        // Draw mesh
        // drawRec(obj, ctx);
        drawRec(obj[0], ctx);
      }
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <Webcam
          ref={webcamRef}
          className='demo123'
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            // textAlign: "center",
            zindex: 9,
            width: 350,
            height: 280,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            // textAlign: "center",
            zindex: 8,
            width: 350,
            height: 280,
          }}
        />
      </header>
      {/* <div style={{ position: "absolute", zIndex: 10 }}>
        <h1>{cardDetected ? "Card detected" : ""}</h1>
        <button onClick={takeShot(data)}>Take Screenshot</button>
      </div> */}
    </div>
  );
};

export default WebcamDetection;
