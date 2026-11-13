import Race from "../race";
import NortheastElectionMap from "./map";
import { updates } from "./updates";

export default function NortheastRace() {
  return (
    <Race
      name="Blue York (Northeast)"
      messages={updates}
      map={<NortheastElectionMap />}
      region="Northeast"
    />
  );
}