import { Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { createContext } from "react";
export type ModalContextType = {
  open: () => void;
  close: () => void;
};
import { useContext } from "react";
import { ErrorContext } from "../ErrorContext/ErrorContext";
export const ModalContext = createContext<ModalContextType | null>(null);
export function ModalProVider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data, error } = useContext(ErrorContext)!;
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <ModalContext.Provider value={{ open, close }}>
      <Modal
        opened={opened}
        onClose={close}
        title=""
        withCloseButton={false}
        centered
        lockScroll={false}
      >
        <div>
          <Text> Add Cart {error ? error.message : data} </Text>
        </div>
      </Modal>
      {children}
    </ModalContext.Provider>
  );
}
