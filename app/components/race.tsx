import DatawrapperEmbed from "@/app/embeds/datawrapper";
import PlotSetEmbed from "@/app/embeds/plotset";
import NortheastElectionMap from "@/app/maps/northeast"
import { ReactNode } from "react";

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
          <PlotSetEmbed
            chartId={plotSetChartId}
            title={name}
            aspect="0.511"
            height={510}
          />
        </div>
      </div>
    );
}