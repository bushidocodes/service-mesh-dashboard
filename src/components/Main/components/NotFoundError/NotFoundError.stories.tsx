import NotFoundError from "./NotFoundError";

export default {
  title: "NotFoundError",
  component: NotFoundError
};

export const Default = {
  render: () => (
    <div style={{ display: "flex" }}>
      <NotFoundError errorMsg={undefined} />
    </div>
  )
};
