import Tooltip from "./index";

const wrapperStyle = {
  display: "flex",
  width: "100vw",
  justifyContent: "center",
  height: "100vh",
  alignItems: "center"
};

export default {
  title: "Tooltip",
  component: Tooltip
};

export const Default = {
  render: () => {
    let content = "This is a super cool tooltip!";
    let position: "top" | "bottom" | "left" | "right" = "top";
    return (
      <div style={wrapperStyle}>
        <Tooltip
          content={content}
          position={position}
          disabled={false}
          containerStyle={{}}
        >
          Hover over me
        </Tooltip>
      </div>
    );
  }
};
