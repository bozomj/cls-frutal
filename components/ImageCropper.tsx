"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";
import Modal from "./Modal";
import utils from "@/utils";
import { backdrop } from "@/ui/backdrop";

export type CroppedAreaPixelsType = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export default function ImageCropper({
  image,
  onConfirm,
}: {
  image: string;
  onConfirm: (img: File) => void;
}) {
  const { openContent, closeContent } = backdrop.useBackdrop();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixelsType | null>(null);

  return (
    <>
      <Modal
        onConfirm={async () => {
          if (croppedAreaPixels !== null) {
            const file = await utils.imagem.getCroppedImg(
              image,
              croppedAreaPixels
            );
            onConfirm(file);
            closeContent();
          }
        }}
        onClose={function (): void {
          closeContent();
        }}
      >
        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => {
              setCroppedAreaPixels(pixels);
            }}
          />
        </div>
      </Modal>
    </>
  );
}
