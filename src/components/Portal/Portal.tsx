import React, { useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
  id: APP.PortalId;
}
const Portal = ({ children, id }: Props) => {
  const ref = useRef<HTMLElement>(document.getElementById(id));
  return ref.current && createPortal(children, ref.current);
};

export default Portal;
