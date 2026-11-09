import DatawrapperEmbed from "@/app/embeds/datawrapper";
import PlotSetEmbed from "@/app/embeds/plotset";

type RaceProps = {
    name: string,
    description: string,
    datawrapperEmbedId: string,
    plotSetChartId: string
    spacer?: boolean
}

export default function Race({
    name,
    description,
    datawrapperEmbedId,
    plotSetChartId,
    spacer = false
}: RaceProps) {
    return (
      <div className="individual-race grid grid-cols-3">
        <div>
          <h3>
            {name}
          </h3>
          <p>
            {description}
          </p>
        </div>
        <div>
          {spacer ? <div className="map-spacer"/> : ""}
          <DatawrapperEmbed
            embedId = {datawrapperEmbedId}
            containerId = {`datawrapper-${datawrapperEmbedId}`}
          />
        </div>
        <div>
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