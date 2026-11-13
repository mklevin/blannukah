import Link from "next/link";
import LiveIndicator from "@/app/components/live";
import Logo from "@/app/components/logo";
import Navigation from "@/app/components/navigation";

import VoteShareMenorah from "@/app/components/meters/menorah";
import NationalElectionMap from "@/app/components/races/national";
import NortheastRace from "@/app/components/races/northeast/northeast";
import MidwestRace from "@/app/components/races/midwest/midwest";


export default function Home() {
  return (
    <main>
      <Logo />
      <Navigation />
      <div className="main-content">
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
          <NortheastRace />
          <div className="subdivider"/>
          <MidwestRace />
        </div>
      </div>
      <footer>
        <span><Link href="https://mattlevin.io">© 2026 The Blue York Rhymes Company</Link></span>
      </footer>
    </main>
  );
}
