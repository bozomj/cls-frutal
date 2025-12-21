"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";

export default function ImageCropper({ image, onFinish }: {image: string, onFinish: (e: unknown) => void}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  return (
    <>
      <div className="relative w-full h-[400px] bg-black">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 5}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) =>{ setCroppedAreaPixels(pixels)
            onFinish(croppedAreaPixels);
          }}
        />
      </div>

      
    </>
  );
}
