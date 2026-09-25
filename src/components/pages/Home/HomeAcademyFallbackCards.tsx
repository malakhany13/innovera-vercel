import { ACADEMY_FALLBACK_TRACKS } from "./constants";
import HomeAcademyFallbackCard from "./HomeAcademyFallbackCard";

export default function HomeAcademyFallbackCards() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {ACADEMY_FALLBACK_TRACKS.map((track, idx) => (
        <HomeAcademyFallbackCard key={track.title} track={track} idx={idx} />
      ))}
    </div>
  );
}
