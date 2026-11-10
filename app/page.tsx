import Link from "next/link";
import LiveIndicator from "@/app/components/live";
import Race from "@/app/components/race";

import NationalElectionMap from "@/app/maps/national";
import NortheastElectionMap from "@/app/maps/northeast";
import MidwestElectionMap from "@/app/maps/midwest";

export default function Home() {

  
  return (
    <main>
      <header>
        <div className="title">
          The Blue York Rhymes
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
            <NationalElectionMap />
          </div>
        </div>
        <div className="senatorials">
          <h2>Senate elections</h2>
          <Race
            name="Blue York (Northeast)"
            description="I have so many words to say about this race, enough to make the text take up two, nay even three lines. So many words that they're going to attempt to encroach on the map's space, but if we've done everything right it'll be fine!"
            map={<NortheastElectionMap />}
            plotSetChartId="5d9a0baa-a500-4421-8a50-a09dbc0ecaf2"
          />
          <div className="subdivider"/>
          <Race
            name="Blichigas (Midwest)"
            description="Some words about this race."
            map={<MidwestElectionMap />}
            plotSetChartId="5d9a0baa-a500-4421-8a50-a09dbc0ecaf2"
            spacer={true}
          />
        </div>
      </div>
      <footer>
        <span><Link href="https://mattlevin.io">© 2026 The Blue York Rhymes Company</Link></span>
      </footer>
    </main>
  );
}
