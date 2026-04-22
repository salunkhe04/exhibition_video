import EnquirySection from "@/component/LiveStream/EnquirySection";
import LiveStream from "@/component/LiveStream/LiveStream";
import ScrollToggleArrow from "@/component/ScrollIndicator";

export default function Home() {
  return (
    <>
      {/* <HomePage /> */}
      <LiveStream />
      <EnquirySection />
      <ScrollToggleArrow footerId="building" heroId="hero" centerVertically />
    </>
  );
}
