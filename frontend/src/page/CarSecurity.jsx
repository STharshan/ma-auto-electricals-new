import HeroTemplate from "../CommonService/HeroTemplate";
import { motHeroData, emergencyCtaData, automotiveServicesData, majorServicesData } from "../ServiceData/CarSecurity";
import EmergencyCtaTemplate from "../CommonService/EmergencyCtaTemplate";
import AutomotiveServicesTemplate from "../CommonService/AutomotiveServicesTemplate";
import MajorServicesTemplate from "../CommonService/MajorServicesTemplate";

export default function CarSecurityPage() {
  return (
    <>
      <HeroTemplate data={motHeroData} />
      <AutomotiveServicesTemplate data={automotiveServicesData} />
      <MajorServicesTemplate data={majorServicesData} />
      <EmergencyCtaTemplate data={emergencyCtaData} />

    </>
  );
}
