// components/PortalWrapper.tsx
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalWrapperProps {
  children: ReactNode;
  containerId?: string; // opcional para poder trocar o destino
}

export default function PortalWrapper({
  children,
  containerId = "portal-root",
}: PortalWrapperProps) {
  const container = document.getElementById(containerId);

  if (!container) return null; // segurança caso o elemento não exista

  return createPortal(children, container);
}
