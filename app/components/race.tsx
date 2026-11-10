import { ReactNode } from "react";
import VoteShareGauge from "@/app/components/gauge";

type RaceProps = {
    name: string,
    description: string,
    map: ReactNode,
    plotSetChartId: string
    spacer?: boolean
}

export default function Race({
    name,
    description,
    map,
    plotSetChartId,
    spacer = false
}: RaceProps) {
    return (
      <div className="individual-race grid grid-cols-1 md:grid-cols-3">
        <div className="description-container">
          <h3>
            {name}
          </h3>
          <p>
            {description}
          </p>
        </div>
        <div className="datawrapper-container">
          {spacer ? <div className="map-spacer"/> : ""}
          {map}
        </div>
        <div className="plotset-container">
          <VoteShareGauge
            optionAShare={0.64}
            optionATotal={125000}
            optionBTotal={70312}
            optionAName="Option A"
            optionBName="Option B"
            caption="Option A leads"
          />
        </div>
      </div>
    );
}