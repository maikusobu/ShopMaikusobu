import {
  Title,
  Avatar,
  Stack,
  Group,
  FileButton,
  Button,
  createStyles,
  Portal,
  TextInput,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import { useGetUserByIdQuery } from "../../api/UserApi/UserApi";
import type { PixelCropType } from "../../Helper/getCroppedImage";
import { blobToDataURL } from "../../Helper/BlobToDataUrl";
import { useAppSelector } from "../../app/hooks";
import getCroppedImg from "../../Helper/getCroppedImage";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { useUpdateUserMutation } from "../../api/UserApi/UserApi";
import useAvatar from "../../hook/useAvatar";
import Cropper from "react-easy-crop";

import { boundingRect } from "../../Helper/boundingRect";
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import {
  IconFileUpload,
  IconDeviceFloppy,
  IconRotate2,
  IconArrowsRightDown,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
const useStyles = createStyles(() => ({
  cropImageContainer: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "540px",
    height: "480px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "1px solid #ccc",
    alignItems: "center",
    zIndex: 10000,
    // paddingTop: "40px",
    backgroundColor: "rgba(0,0,0,1)",
  },
  cropBox: {
    background: "rgb(0,0,0)",
    position: "relative",
    width: "400px",

    height: "350px",
  },
  FileButton: {
    cursor: "pointer",
  },
  formContainer: {
    position: "relative",
    "& > *": {
      marginTop: "1.5rem",
    },
    "& > *:first-child": {
      marginTop: 0,
    },
  },
}));
function GeneralInfo() {
  const [, setFile] = useState<File | null>(null);
  const auth = useAppSelector(selectAuth);
  const { data } = useGetUserByIdQuery(auth.id, { skip: !auth.isLoggedIn });
  const { classes } = useStyles();
  const imageUrl = useAvatar(data ? data : null);
  const [image, setImage] = useState<string | null>(null);
  const [firstname, setFirstname] = useState<string>(
    data?.first_name as string
  );
  const [show, setShow] = useState(false);
  const buttonRotateRef = useRef<HTMLButtonElement>(null);
  const onMouseMove = useRef<((e: MouseEvent) => void) | null>(null);
  const onMouseUp = useRef<((e: MouseEvent) => void) | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (data) {
      setFirstname(data.first_name);
      setLastname(data.last_name);
    }
  }, [data]);
  const [lastname, setLastname] = useState<string>(data?.last_name as string);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const ImageRef = useRef<HTMLImageElement>(null);
  const dataUrlRef = useRef<string | null>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  } | null>(null);
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image as string,
        croppedAreaPixels as PixelCropType,
        rotation
      );

      dataUrlRef.current = await blobToDataURL(croppedImage as Blob);

      const url = URL.createObjectURL(croppedImage as Blob);

      if (ImageRef.current) {
        ImageRef.current.src = url;
      }
    } catch (e) {
      console.log(e);
    }
  }, [croppedAreaPixels, image, rotation]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage(reader.result as string);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = "";
  };
  const handleCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };
  const handleZoomChange = (newZoom: number) => {
    console.log(newZoom);
    setZoom(newZoom);
  };
  const handleCropComplete = (
    _croppedArea: { x: number; y: number; width: number; height: number },
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", auth.id);
    formData.append("username", data?.username as string);
    formData.append(
      "first_name",
      (e.target as HTMLFormElement).first_name.value
    );
    formData.append("last_name", (e.target as HTMLFormElement).last_name.value);
    if (dataUrlRef.current) {
      formData.append("avatar", dataUrlRef.current as string);
    }
    formData.append("picture", "");
    const dataObject = Object.fromEntries(formData);
    updateUser(dataObject)
      .unwrap()
      .then(() => {
        notifications.show({
          id: "hello-there",
          withCloseButton: true,
          onClose: () => console.log("unmounted"),
          onOpen: () => console.log("mounted"),
          autoClose: 2000,
          title: "Succes",
          message: "Save info succesfully",
          color: "green",
          style: { backgroundColor: "green" },
          sx: { backgroundColor: "green" },
          loading: false,
        });
      })
      .catch((err) => console.log(err, "fdd"));
  };
  console.log(rotation, "rotation");
  return (
    <>
      {show && (
        <IconArrowsRightDown
          style={{
            rotate: `${rotation - 45}deg`,
            position: "absolute",
            top: `${position.y}px`,
            left: `${position.x}px`,
            zIndex: 99999999,
          }}
        />
      )}
      <form className={classes.formContainer} onSubmit={handleSubmit}>
        <LoadingOverlay
          loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
          overlayOpacity={0.8}
          overlayColor="#c5c5c5"
          visible={isLoading}
        />
        <Title order={4}>Your General Information</Title>

        <Group>
          <Avatar
            src={imageUrl}
            alt="avatar"
            radius="xl"
            size={40}
            imageProps={{
              ref: ImageRef,
            }}
          />
          <FileButton
            inputProps={{ onChange: handleFileChange }}
            onChange={setFile}
            accept="image/*"
            name="avatar"
          >
            {(props) => (
              <Button
                {...props}
                variant="light"
                leftIcon={<IconFileUpload size={"1.3rem"} />}
                className={classes.FileButton}
              >
                Change your Avatar
              </Button>
            )}
          </FileButton>
        </Group>
        <Group>
          <TextInput
            label="First Name"
            value={firstname ? firstname : ""}
            name="first_name"
            onChange={(e) => setFirstname(e.currentTarget.value)}
          />
        </Group>
        <Group>
          <TextInput
            label="Last Name"
            name="last_name"
            value={lastname ? lastname : ""}
            onChange={(e) => setLastname(e.currentTarget.value)}
          />
        </Group>
        <Button
          variant="light"
          type="submit"
          leftIcon={<IconDeviceFloppy size="1.3rem" />}
        >
          Save
        </Button>
      </form>
      {image && (
        <Portal target={document.getElementById("container") as HTMLElement}>
          <div className={classes.cropImageContainer}>
            <div className={classes.cropBox}>
              <Cropper
                cropShape="round"
                image={image as string}
                crop={crop}
                setImageRef={(ref) => {
                  imageRef.current = ref.current;
                }}
                zoom={zoom}
                aspect={1}
                maxZoom={10}
                rotation={rotation}
                onRotationChange={setRotation}
                onCropChange={handleCropChange}
                onZoomChange={handleZoomChange}
                onCropComplete={handleCropComplete}
              />
            </div>
            <ActionIcon
              ref={buttonRotateRef}
              onMouseEnter={(e) => {
                setPosition({
                  x:
                    e.clientX -
                    (buttonRotateRef.current
                      ? buttonRotateRef.current?.clientWidth / 2
                      : 0),
                  y:
                    e.clientY -
                    (buttonRotateRef.current
                      ? buttonRotateRef.current.clientHeight / 2
                      : 0),
                });
              }}
              style={{
                top: ` calc(50% - ${
                  (buttonRotateRef.current
                    ? buttonRotateRef.current.clientHeight
                    : 0) / 2
                }px)`,
                left: `calc(50% - ${
                  (buttonRotateRef.current
                    ? buttonRotateRef.current.clientWidth
                    : 0) / 2
                }px)`,
                opacity: !show ? "1" : "0",
                position: "absolute",
                transform: ` rotate(${rotation}deg) translateX(-${
                  230 - (rotation > 180 ? rotation / 2 : rotation) / 10
                }px)`,
              }}
              onMouseDown={(e: React.MouseEvent) => {
                e.preventDefault();
                setShow(true);
                document.body.classList.add("cursor-none");
                // const startX = e.clientX;
                // const startY = e.clientY;

                // const rect = buttonRotateRef.current?.getBoundingClientRect();
                // const centerX =
                //   ((startX as number) + (window.innerWidth as number)) / 2;
                // const centerY =
                //   ((startY as number) + (window.innerHeight as number)) / 2;
                // const startAngle = Math.atan2(
                //   startY - centerY,
                //   startX - centerX

                // console.log(startAngle);
                // console.log(rect);
                // console.log(centerX);
                // console.log(centerY);

                const imageBoundingRect = boundingRect(
                  imageRef.current as HTMLElement
                );
                console.log(imageBoundingRect);
                console.log(imageRef.current?.offsetTop);
                const imageCenter = {
                  x:
                    imageBoundingRect.left / zoom +
                    (imageBoundingRect.width - imageBoundingRect.width / zoom) /
                      zoom +
                    imageBoundingRect.width / zoom / 2,

                  y:
                    imageBoundingRect.top / zoom +
                    (imageBoundingRect.height -
                      imageBoundingRect.height / zoom) /
                      zoom +
                    imageBoundingRect.height / zoom / 2,
                };
                console.log(imageCenter);
                onMouseMove.current = (ev: MouseEvent): void => {
                  const currentX = ev.clientX;
                  const currentY = ev.clientY;

                  setPosition({
                    x: currentX,
                    y: currentY,
                  });
                  const currentAngle = Math.atan2(
                    currentY - imageCenter.y,
                    currentX - imageCenter.x
                  );
                  const deltaAngle = currentAngle;

                  let angleInDegrees =
                    Math.round((deltaAngle * 180) / Math.PI) - 180;
                  angleInDegrees = (angleInDegrees + 360) % 360;
                  console.log(angleInDegrees);
                  requestAnimationFrame(() => {
                    setRotation(angleInDegrees);
                  });

                  if (imageRef.current) {
                    // console.log(imageRef.current.getBoundingClientRect());
                  }
                };

                document.addEventListener("mousemove", onMouseMove.current);
                onMouseUp.current = () => {
                  setShow(false);
                  document.body.classList.remove("cursor-none");
                  document.removeEventListener(
                    "mousemove",
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    onMouseMove.current!
                  );
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  document.removeEventListener("mouseup", onMouseUp.current!);
                };
                document.addEventListener("mouseup", onMouseUp.current);
              }}
            >
              <IconRotate2 />
            </ActionIcon>
            <Stack sx={{ width: "100%" }}>
              {/* <Group>
                <Text
                  style={{
                    width: "60px",
                  }}
                >
                  Rotation
                </Text>
                <Slider
                  labelTransition="pop-top-right"
                  labelTransitionDuration={150}
                  labelTransitionTimingFunction="ease"
                  onChange={setRotation}
                  value={rotation}
                  style={{
                    flexGrow: 1,
                  }}
                  min={0}
                  max={360}
                  label={(value) => value.toFixed(0)}
                  step={10}
                />
              </Group> */}
              {!show && (
                <Button
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                  }}
                  onClick={() => {
                    showCroppedImage();
                    setImage(null);
                    setFile(null);
                    setCroppedAreaPixels(null);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                  }}
                >
                  Cắt
                </Button>
              )}
            </Stack>
          </div>
        </Portal>
      )}
    </>
  );
}

export default GeneralInfo;
