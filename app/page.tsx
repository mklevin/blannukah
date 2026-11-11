import Link from "next/link";
import LiveIndicator from "@/app/components/live";
import Logo from "@/app/components/logo";
import Navigation from "@/app/components/navigation";
import Race from "@/app/components/race";

import NationalElectionMap from "@/app/maps/national";
import NortheastElectionMap from "@/app/maps/northeast";
import MidwestElectionMap from "@/app/maps/midwest";

import VoteShareMenorah from "@/app/components/meters/menorah";

export default function Home() {
  return (
    <main>
      <Logo />
      <Navigation />
      <div className="mainContent">
        <div id="presidential">
          <LiveIndicator />
          <h1>Hanukkah List Presidential Election</h1>
          <div className="subtext">Something about this map.</div>

          <VoteShareMenorah />
          
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
            region="Northeast"
          />
          <div className="subdivider"/>
          <Race
            name="Blichigas (Midwest)"
            description="Some words about this race."
            map={<MidwestElectionMap />}
            region="Midwest"
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
