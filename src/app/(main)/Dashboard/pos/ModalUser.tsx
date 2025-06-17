import {
  Card,
  CardContent,
  Modal,
  Input,
  Button,
  Textarea,
} from "@/components";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  handleModal: () => void;
}

export const ModalUser = ({ isOpen, handleModal }: Props) => {
  return (
    <Modal isOpen={isOpen} handleModal={handleModal}>
      <Card backgroundColor="white">
        <form>
          <CardContent
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <Input label="Nombres" type="text" placeholder="Nombres" />
            <Input label="Apellidos" type="text" placeholder="Apellidos" />
            <Input label="Correo" type="text" placeholder="Correo" />
            <Textarea
              style={{ gridColumn: "span 1", height: "100px", width: "100%" }}
              label="Dirección"
              placeholder="Dirección"
            />
            <Input label="Teléfono" type="text" placeholder="Teléfono" />
            <Input label="DNI" type="text" placeholder="DNI" />
            <Input label="Wallet" type="text" placeholder="Wallet" />
          </CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "1rem",
            }}
          >
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Card>
    </Modal>
  );
};
