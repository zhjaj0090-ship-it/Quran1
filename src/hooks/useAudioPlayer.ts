import { useState, useEffect, useRef, useCallback } from 'react';
import { Surah, Reciter, RadioStation } from '../types';
import { RECITERS, getSurahAudioUrl } from '../data/reciters';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentType, setCurrentType] = useState<'surah' | 'radio' | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onPlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setErrorMsg(null);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsBuffering(false);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
      setErrorMsg("تعذر تحميل الملف الصوتي، يرجى المحاولة مرة أخرى أو اختيار قارئ آخر.");
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const playSurah = useCallback((surah: Surah, reciter?: Reciter) => {
    const activeReciter = reciter || selectedReciter;
    if (reciter) {
      setSelectedReciter(reciter);
    }
    const url = getSurahAudioUrl(activeReciter.serverUrl, surah.number);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
      setIsBuffering(true);
      setErrorMsg(null);

      audioRef.current.play().catch(e => {
        console.warn("Auto-play prevented:", e);
        setIsPlaying(false);
        setIsBuffering(false);
      });
    }

    setCurrentType('surah');
    setCurrentSurah(surah);
    setCurrentRadio(null);
  }, [selectedReciter, playbackRate, isMuted, volume]);

  const playRadio = useCallback((station: RadioStation) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = station.url;
      audioRef.current.playbackRate = 1;
      audioRef.current.volume = isMuted ? 0 : volume;
      setIsBuffering(true);
      setErrorMsg(null);

      audioRef.current.play().catch(e => {
        console.warn("Auto-play prevented:", e);
        setIsPlaying(false);
        setIsBuffering(false);
      });
    }

    setCurrentType('radio');
    setCurrentRadio(station);
    setCurrentSurah(null);
  }, [isMuted, volume]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.src) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const changeReciter = useCallback((reciter: Reciter) => {
    setSelectedReciter(reciter);
    if (currentType === 'surah' && currentSurah) {
      playSurah(currentSurah, reciter);
    }
  }, [currentType, currentSurah, playSurah]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setIsBuffering(false);
    setCurrentType(null);
    setCurrentSurah(null);
    setCurrentRadio(null);
  }, []);

  return {
    isPlaying,
    isBuffering,
    currentType,
    currentSurah,
    currentRadio,
    selectedReciter,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    errorMsg,
    playSurah,
    playRadio,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    changeReciter,
    stop
  };
}
