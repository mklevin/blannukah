import DatawrapperEmbed from "@/app/embeds/datawrapper";
import Link from "next/link";
import LiveIndicator from "@/app/live";
import PlotSetEmbed from "@/app/embeds/plotset";
import Race from "@/app/race";

export default function Home() {
  return (
    <main>
      <header>
        <div className="title">
          The Blue York Thymes
        </div>
      </header>
      <div className="mainContent">
        <div id="presidential">
          <LiveIndicator
            lastUpdated="11:00pm E.T."
          />
          <h1>Hanukkah List Presidential Election Results</h1>
            <div className="subtext">Something about this map.</div>
          <div className="map">
            <DatawrapperEmbed
              embedId="1T2G9"
              containerId="datawrapper1"
            />
          </div>
        <PlotSetEmbed
          chartId="5d9a0baa-a500-4421-8a50-a09dbc0ecaf2"
          title="Presidential race chart"
          aspect="0.511"
          height={510}
        />
        </div>
        <div className="senatorials">
          <h2>Senate elections</h2>
          <Race
            name="Blue York (Northeast)"
            description="I have so many words to say about this race, enough to make the text take up two, nay even three lines. So many words that they're going to attempt to encroach on the map's space, but if we've done everything right it'll be fine!"
            datawrapperEmbedId="ztBqX"
            plotSetChartId="5d9a0baa-a500-4421-8a50-a09dbc0ecaf2"
          />
          <div className="subdivider"/>
          <Race
            name="Blichigas (Midwest)"
            description="Some words about this race."
            datawrapperEmbedId="ccL45"
            plotSetChartId="5d9a0baa-a500-4421-8a50-a09dbc0ecaf2"
            spacer={true}
          />
        </div>
      </div>
      <footer>
        <span><Link href="https://mattlevin.io">© 2026 The Blue York Thymes Company</Link></span>
      </footer>
    </main>
  );
}
