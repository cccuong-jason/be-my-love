"use client";
import { useState, useEffect, useRef } from 'react';
import { useContentStore } from '@/store/contentStore';
import { Play, Pause } from 'lucide-react';

export default function MusicPlayer() {
    const music = useContentStore((state) => state.music);
    const [isPlaying, setIsPlaying] = useState(false);
    const [ytPlayer, setYtPlayer] = useState<any>(null);

    // Helper to extract ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(music.url);

    // Load YouTube Iframe API
    useEffect(() => {
        if (!videoId) return;

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            // API Ready
            createPlayer();
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
        }

        function createPlayer() {
            if (ytPlayer) return;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const player = new (window as any).YT.Player('youtube-player', {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: {
                    'autoplay': 1, // Attempt autoplay
                    'controls': 0,
                    'loop': 1,
                    'playlist': videoId // Required for loop
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            setYtPlayer(player);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    // Handle URL updates
    useEffect(() => {
        if (ytPlayer && videoId && typeof ytPlayer.loadVideoById === 'function') {
            ytPlayer.loadVideoById(videoId);
        }
    }, [music.url, videoId, ytPlayer]);

    const onPlayerReady = (event: any) => {
        // Optional: try autoplay
        // event.target.playVideo(); 
    };

    const onPlayerStateChange = (event: any) => {
        if (event.data === 1) setIsPlaying(true);
        if (event.data === 2) setIsPlaying(false);
    };

    const togglePlay = () => {
        if (!ytPlayer) return;
        if (isPlaying) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
        setIsPlaying(!isPlaying);
    };

    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        setIsPublic(new URLSearchParams(window.location.search).get('public') === 'true');
    }, []);

    if (!videoId) return null;

    return (
        <>
            <div id="youtube-player" style={{ position: 'absolute', top: -9999, left: -9999 }}></div>
            <button
                onClick={togglePlay}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '30px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.8)',
                    border: '2px solid var(--hot-pink)',
                    color: 'var(--hot-pink)',
                    zIndex: 1000,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        </>
    );
}

// Add types
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: any;
    }
}
