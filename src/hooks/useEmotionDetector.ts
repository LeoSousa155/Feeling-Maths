import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

export interface EmotionState {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    fearful: number;
    disgusted: number;
    neutral: number;
}

interface UseEmotionDetectorReturn {
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    emotion: EmotionState | null;
    loading: boolean;
    error: string | null;
    startDetection: () => Promise<void>;
    stopDetection: () => void;
}

export function useEmotionDetector(): UseEmotionDetectorReturn {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [emotion, setEmotion] = useState<EmotionState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const detectionIntervalRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startDetection = async () => {
        try {
            setLoading(true);
            setError(null);

            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            ]);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                },
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setLoading(false);

                    if (detectionIntervalRef.current) {
                        clearInterval(detectionIntervalRef.current);
                    }

                    detectionIntervalRef.current = setInterval(async () => {
                        if (
                            videoRef.current &&
                            videoRef.current.readyState === 4
                        ) {
                            try {
                                const detections = await faceapi
                                    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                                    .withFaceLandmarks()
                                    .withFaceExpressions();

                                if (detections.length > 0) {
                                    setEmotion(detections[0].expressions as EmotionState);
                                } else {
                                    setEmotion(null);
                                }
                            } catch (err) {
                                console.error('Erro na detecção:', err);
                            }
                        }
                    }, 500);
                };
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Erro ao inicializar câmara';
            setError(errorMessage);
            setLoading(false);
            console.error('Erro ao inicializar detecção de emoções:', err);
        }
    };

    const stopDetection = () => {
        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setEmotion(null);
        setLoading(false);
    };

    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, []);

    return {
        videoRef,
        emotion,
        loading,
        error,
        startDetection,
        stopDetection,
    };
}