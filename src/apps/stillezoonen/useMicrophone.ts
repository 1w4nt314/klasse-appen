"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MicStatus =
  | "idle"
  | "requesting"
  | "running"
  | "denied"
  | "unavailable"
  | "error";

/** dBFS-intervallet der mappes til 0–100 på lydmåleren. */
const FLOOR_DB = -70;
const CEIL_DB = -15;
/** Tidskonstanter (sek.) — hurtig op, langsommere ned, så måleren ikke flimrer. */
const ATTACK = 0.08;
const RELEASE = 0.45;

/**
 * Mikrofonadgang og lydniveau. Lyden analyseres udelukkende lokalt i
 * browseren — intet optages, gemmes eller sendes.
 */
export function useMicrophone() {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [muted, setMutedState] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const levelRef = useRef(0);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    contextRef.current?.close().catch(() => {});
    streamRef.current = null;
    contextRef.current = null;
    analyserRef.current = null;
    levelRef.current = 0;
    setMutedState(false);
    setStatus("idle");
  }, []);

  /**
   * Slå mikrofonen fra/til (fx mens læreren giver en besked). Lydsporet slås fra
   * i browseren, så måleren ser stilhed og dyrene bliver.
   */
  const setMuted = useCallback((next: boolean) => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMutedState(next);
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Rå lyd: ellers "hjælper" browseren ved at skrue op når der er stille.
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      streamRef.current = stream;
      contextRef.current = context;
      analyserRef.current = analyser;
      bufferRef.current = new Float32Array(analyser.fftSize);
      setStatus("running");
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setStatus("denied");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    }
  }, []);

  /** Læs og udglat lydniveauet (0–100). Kaldes én gang pr. frame. */
  const readLevel = useCallback((dt: number) => {
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    if (!analyser || !buffer) return 0;

    analyser.getFloatTimeDomainData(buffer);
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
    const rms = Math.sqrt(sum / buffer.length);
    const db = 20 * Math.log10(rms + 1e-9);
    const target = Math.min(
      100,
      Math.max(0, ((db - FLOOR_DB) / (CEIL_DB - FLOOR_DB)) * 100),
    );

    const tau = target > levelRef.current ? ATTACK : RELEASE;
    const k = 1 - Math.exp(-dt / tau);
    levelRef.current += (target - levelRef.current) * k;
    return levelRef.current;
  }, []);

  useEffect(() => stop, [stop]);

  return { status, start, stop, readLevel, muted, setMuted };
}
