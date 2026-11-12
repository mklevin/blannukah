import Race from "@/app/components/race";
import NortheastElectionMap from "@/app/maps/northeast";
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