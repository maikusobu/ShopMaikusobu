import {
  Title,
  Avatar,
  Stack,
  Text,
  Group,
  FileButton,
  Button,
  createStyles,
  Slider,
  Portal,
  TextInput,
  LoadingOverlay,
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
import { ErrorContext } from "../ErrorContext/ErrorContext";
import { useState, useRef, useCallback, useEffect, useContext } from "react";
import { IconFileUpload, IconDeviceFloppy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
const useStyles = createStyles(() => ({
  cropImageContainer: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "500px",
    height: "500px",

    zIndex: 10000,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cropBox: {
    background: "rgb(0,0,0)",
    position: "relative",
    width: "500px",
    height: "400px",
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
  const { error: err } = useContext(ErrorContext);
  const { classes } = useStyles();
  const imageUrl = useAvatar(data ? data : null);
  const [image, setImage] = useState<string | null>(null);
  const [firstname, setFirstname] = useState<string>(
    data?.first_name as string
  );

  useEffect(() => {
    console.log("children");
    console.log(err);
    if (data) {
      setFirstname(data.first_name);
      setLastname(data.last_name);
    }
  }, [data, err]);
  const [lastname, setLastname] = useState<string>(data?.last_name as string);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const ImageRef = useRef<HTMLImageElement>(null);
  const dataUrlRef = useRef<string | null>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

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
      console.log(dataUrlRef.current.length, ImageRef.current?.src.length);
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
    console.log(dataUrlRef.current);

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

          className: "my-notification-class",
          style: { backgroundColor: "green" },
          sx: { backgroundColor: "green" },
          loading: false,
        });
      })
      .catch((err) => console.log(err, "fdd"));
  };

  return (
    <>
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
                zoom={zoom}
                aspect={1}
                rotation={rotation}
                onRotationChange={setRotation}
                onCropChange={handleCropChange}
                onZoomChange={handleZoomChange}
                onCropComplete={handleCropComplete}
              />
            </div>
            <Stack>
              <Group>
                <Text
                  style={{
                    width: "60px",
                  }}
                >
                  Zoom
                </Text>
                <Slider
                  labelTransition="pop-top-right"
                  labelTransitionDuration={150}
                  labelTransitionTimingFunction="ease"
                  onChange={setZoom}
                  value={zoom}
                  style={{
                    flexGrow: 1,
                  }}
                  min={1}
                  step={0.5}
                  max={30}
                  label={(value) => value.toFixed(0)}
                />
              </Group>
              <Group>
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
              </Group>
              <button
                onClick={() => {
                  showCroppedImage();
                  setImage(null);
                  setFile(null);
                  setCroppedAreaPixels(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
              >
                Crop
              </button>
            </Stack>
          </div>
        </Portal>
      )}
    </>
  );
}

export default GeneralInfo;
