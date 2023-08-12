import React from "react";

interface StatusIconProps {
  connected: boolean;
}

const StatusIcon: React.FC<StatusIconProps> = ({ connected }) => {
  return <i className={`icon ${connected ? "connected" : ""}`}></i>;
};

export default StatusIcon;
