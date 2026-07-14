import GMServiceHeader from "./GMServiceHeader";

export default {
  title: "Grouping Header",
  component: GMServiceHeader
};

export const NormalHeader = {
  render: () => (
    <GMServiceHeader headerTitle="Sample Title" showStatusIcon={false} />
  )
};

export const WithStatusIcon = {
  render: () => <GMServiceHeader headerTitle="Stable" showStatusIcon={true} />
};
