import Race from "../race";
import WestElectionMap from "./map";
import { updates } from "./updates";

export default function MidwestRace() {
  return (
    <Race
      name="Blacific (West)"
      messages={updates}
      map={<WestElectionMap />}
      region="West"
    />
  );
}