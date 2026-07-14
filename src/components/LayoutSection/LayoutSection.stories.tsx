import Readout from "components/Main/components/Readout";
import ReadoutGroup from "components/Main/components/ReadoutGroup";
import LayoutSection from "./LayoutSection";

export default {
  title: "Layout Section",
  component: LayoutSection
};

export const Default = {
  render: () => (
    <LayoutSection title="Test Layout" icon="CPU" flex={false}>
      <ReadoutGroup>
        <Readout
          readoutItems={[
            {
              title: "Uptime",
              value: "1000ms"
            }
          ]}
        />
        <Readout
          primary
          readoutItems={[
            {
              title: "Error Rate",
              value: "0.000%",
              icon: "Summary"
            }
          ]}
        />
        <Readout
          readoutItems={[
            {
              title: "Host CPU Cores",
              value: "0"
            }
          ]}
        />
      </ReadoutGroup>
    </LayoutSection>
  )
};
