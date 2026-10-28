import { useRef, type SyntheticEvent } from "react";
import type { ProjectVisualisation } from "../services/developmentProjects";

export function ProjectVideoPlayer({ video, labelledBy }: { video: NonNullable<ProjectVisualisation["video"]>; labelledBy: string }) {
  const audioInitialised = useRef(false);

  const initialiseAudio = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (audioInitialised.current) return;
    const player = event.currentTarget;
    player.defaultMuted = false;
    player.muted = false;
    player.volume = 1;
    audioInitialised.current = true;
  };

  return (
    <video controls playsInline preload="none" onPlay={initialiseAudio} poster={video.poster} width={video.width} height={video.height} aria-labelledby={labelledBy} className="aspect-video w-full rounded-2xl border border-[#0B5E3C]/15 bg-[#111] object-contain">
      <source src={video.src} type="video/mp4" />
      Your browser does not support embedded video. <a href={video.src}>Download the 3D walkthrough</a>.
    </video>
  );
}
