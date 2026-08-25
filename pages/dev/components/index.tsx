import {
  Alert,
  CircleAvatar,
  IconButton,
  ImageCardPreview,
  ImageCropper,
  LinearProgressIndicator,
  MiniGalleryImage,
  Modal,
} from "@/components";
import Card from "@/components/Card";
import CarrosselScroll from "@/components/CarrosselScroll";
import HorizontalDivider from "@/components/HorizontalDivider";
import ImageCarrousel from "@/components/ImageSlider";
import InputFile from "@/components/InputFile";
import ListTile from "@/components/ListTile";
import PointIndicator from "@/components/PointIndicator";
import ProductCardDashboard from "@/components/ProductCardDasboard";
import Prompt, { TypePrompt } from "@/components/Prompt";
import { ButtonPrimary } from "@/components/ui/Buttons";
import Row from "@/components/ui/row";
import { SlideButton } from "@/components/ui/SlideButton";
import { ToggleSlide } from "@/components/ui/ToogleSlide";
import VerticalDivider from "@/components/VerticalDivider";
import { ImageStatus } from "@/shared/Image_types";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import utils from "@/utils";
import { faPerbyte } from "@fortawesome/free-brands-svg-icons";
import { fa3, faAirFreshener, faUser } from "@fortawesome/free-solid-svg-icons";

export default function DevComponents() {
  const urlBase = "https://pub-cf2ec8db2f184d2ab44495473e1c1c12.r2.dev/";
  const imagens = [
    {
      url: "01cbc2b9a2c6def470ac55dc1d39ef4e.webp",
      status: "ACTIVE",
    },
    {
      url: "0ca31797bdbba026fea91efd8671ee04.image",
      status: "ACTIVE",
    },
    {
      url: "0cb31ab87bd5f642d52003c7a3b63ccb.webp",
      status: "ACTIVE",
    },
    {
      url: "168c8e48bc60fd9ad076c10cb8148255.webp",
      status: "ACTIVE",
    },
  ];

  const usebackdrop = useBackdrop();

  return (
    <div className="bg-gray-300 text-slate-800 w-full h-full p-2">
      <Card className="border">teste</Card>
      <CircleAvatar imagem={urlBase + imagens[1].url} />
      <div className="w-2/3">
        <CarrosselScroll items={imagens} time={2} />
      </div>
      <VerticalDivider height={5} />
      <h1>ImageCardPreview</h1>
      <Row className="items-stretch">
        <ImageCardPreview
          image={{
            id: "",
            file: undefined,
            post_id: undefined,
            url: utils.getUrlImageR2(imagens[0].url),
          }}
          alertMsg="preview"
          active={false}
        />
        <HorizontalDivider />
        <ImageCardPreview
          image={{
            id: "",
            file: undefined,
            post_id: undefined,
            url: utils.getUrlImageR2(imagens[2].url),
          }}
        />
        <HorizontalDivider />
        <ImageCardPreview
          image={{
            id: "",
            file: undefined,
            post_id: undefined,
            url: utils.getUrlImageR2(imagens[1].url),
          }}
          alertMsg="qualquer"
        />
      </Row>
      <Row>
        <IconButton icon={faPerbyte} className="border p-3 rounded-full" />
        <IconButton icon={faUser} className=" border p-3 rounded-full" />
        {/* <ImageCropper
          image={urlBase + imagens[1].url}
          onConfirm={function (img: File): void {
            throw new Error("Function not implemented.");
          }}
        /> */}
      </Row>
      <ImageCarrousel images={imagens} />
      <Row>
        <InputFile />
        <LinearProgressIndicator />
        <ListTile title="qualquer coisa" icon={faAirFreshener} />
        <MiniGalleryImage post_imagens={imagens} />
      </Row>
      <Row>
        <PointIndicator index={1} points={10} />
        <ProductCardDashboard
          item={{
            valor: 17.55,
            status: "active",
            imagens: imagens,
            imageurl: imagens[1].url,
            title: "teste de titulo",
          }}
        />

        <ButtonPrimary
          label={"OpenAlert"}
          onClick={() => {
            usebackdrop.openContent(
              <Alert
                msg={"atencao"}
                onClose={() => {
                  usebackdrop.closeContent();
                }}
              />,
            );
          }}
        />
        <ButtonPrimary
          label={"OpenPromt"}
          onClick={() => {
            usebackdrop.openContent(
              <Prompt
                msg={"qual sua responsta"}
                value={"Insira sua resposta"}
                confirm={function (e: string | null): void {
                  alert(e);
                  usebackdrop.closeContent();
                }}
              />,
            );
          }}
        />
      </Row>
      <Row>
        <ToggleSlide value={false} onChange={() => {}} />
        <ToggleSlide value={true} onChange={() => {}} />

        <ToggleSlide
          value={true}
          onChange={() => {
            utils.sleep();
            console.log("sleep");
          }}
        />
        <div className="w-[120px]">
          <SlideButton
            value={false}
            onChange={async () => {
              await utils.sleep();
              console.log("sleep");
            }}
          />
        </div>
      </Row>
    </div>
  );
}
