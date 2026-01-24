import httpCarrosselImage from "@/http/carrossel_image";
import { useEffect, useState } from "react";

export function useCarrosselImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    httpCarrosselImage
      .getImagesCarrossel()
      .then(setImages)
      .catch(console.error);
  }, []);

  return images;
}
