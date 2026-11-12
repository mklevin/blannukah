
import type { ReactNode } from "react";
import VoteShareGauge from "@/app/components/meters/gauge";
import type { CensusRegion } from "@/app/lib/constants/geography";
import LatestUpdates from "@/app/components/latest-updates";

type Author = {
  image: string;
  name: string;
  jobTitle: string;
};

type Message = {
  text: string;
  author?: Author;
};

type RaceProps = {
  name: string;
  messages: Message[];
  map: ReactNode;
  region: CensusRegion;
  spacer?: boolean;
};

export default function Race({
  name,
  messages,
  map,
  region,
  spacer = false,
}: RaceProps) {
  return (
    <div className="individual-race grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3 items-start">
      <div className="description-container min-w-0 md:col-span-2 lg:col-span-1">
        <h3>{name}</h3>
        <LatestUpdates messages={messages} />
      </div>

      <div className="datawrapper-container min-w-0">
        {spacer && <div className="map-spacer" />}
        {map}
      </div>

      <div className="plotset-container min-w-0">
        <VoteShareGauge region={region} />
      </div>
    </div>
  );
}
