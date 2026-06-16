import HeroTemplate from "../CommonService/HeroTemplate";
import { motHeroData, emergencyCtaData, automotiveServicesData, majorServicesData } from "../ServiceData/Mechanical";
import EmergencyCtaTemplate from "../CommonService/EmergencyCtaTemplate";
import AutomotiveServicesTemplate from "../CommonService/AutomotiveServicesTemplate";
import MajorServicesTemplate from "../CommonService/MajorServicesTemplate";

export default function MechanicalPage() {
  return (
    <>
      <HeroTemplate data={motHeroData} />
      <AutomotiveServicesTemplate data={automotiveServicesData} />
      <MajorServicesTemplate data={majorServicesData} />
      <EmergencyCtaTemplate data={emergencyCtaData} />

    </>
  );
}
