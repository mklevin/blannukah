import Race from "../race";
import MidwestElectionMap from "./map";
import { updates } from "./updates";

export default function MidwestRace() {
  return (
    <Race
      name="Blichigas (Midwest)"
      messages={updates}
      map={<MidwestElectionMap />}
      region="Midwest"
    />
  );
}