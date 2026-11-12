import Race from "@/app/components/race";
import MidwestElectionMap from "@/app/maps/midwest";
import { updates } from "./updates";

export default function MidwestRace() {
  return (
    <Race
      name="Blichigas (Midwest)"
      messages={updates}
      map={<MidwestElectionMap />}
      region="Northeast"
    />
  );
}