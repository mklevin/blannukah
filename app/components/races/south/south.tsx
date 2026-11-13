import Race from "../race";
import SouthElectionMap from "./map";
import { updates } from "./updates";

export default function MidwestRace() {
  return (
    <Race
      name="Blexassippi (South)"
      messages={updates}
      map={<SouthElectionMap />}
      region="South"
    />
  );
}