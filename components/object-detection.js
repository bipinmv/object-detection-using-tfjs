"use client";

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs"; // this is being used with coco-ssd
import { renderPrediction } from '@/utils/utilities';

const ObjectDetection = () => {
  const camRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const showVideo = () => {
    if (camRef.current !== null && camRef.current.video?.readyState === 4) {
      camRef.current.video.width = camRef.current.video.videoWidth;
      camRef.current.video.height = camRef.current.video.videoHeight;
    }
  }

  const runCoco = async () => {
    setLoading(true);
    const model = await cocoSSDLoad();
    setLoading(false);

    const interval = setInterval(() => {
      runObjectDetection(model);
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }

  const runObjectDetection = async (model) => {
    if (canvasRef.current && camRef.current !== null && camRef.current.video?.readyState === 4) {
      canvasRef.current.width = camRef.current.video.videoWidth;
      canvasRef.current.height = camRef.current.video.videoHeight;

      // find detected objects
      const detectedObjects = await model.detect(camRef.current.video, undefined, 0.8);
      console.log(detectedObjects);

      const context = canvasRef.current.getContext("2d");
      renderPrediction(detectedObjects, context);
    }
  }

  useEffect(() => {
    showVideo();
    runCoco();
  }, [])


  return (
    <div className='mt-8'>
      {loading ?
        <div className="gradient-title" >Loading AI Model...</div>
        :
        <div className='relative flex items-center justify-center gradient p-1.5 rounded-md'>
          <Webcam
            ref={camRef}
            muted
            className='rounded-md w-full lg:h-[720px]'
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-9999 w-full lg:h-[720px]"
          />
        </div>}

    </div>
  )
}

export default ObjectDetection;