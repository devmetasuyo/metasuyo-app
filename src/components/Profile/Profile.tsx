"use client";
import "./Profile.scss";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useBasename } from "@/hooks/useBasename";

export function Profile() {
  const { address } = useAccount();
  const { data } = useBasename(address as `0x${string}`);

  const [showModal, setShowModal] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [name, setName] = useState(address);
  const [xUrl, setXUrl] = useState("");
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const route = useRouter();
  function getLastTwoDigits(address: string) {
    return address.slice(-2);
  }

  useEffect(() => {
    if (!address) {
      route.replace("/");
    } else {
      // Aquí puedes agregar la lógica para verificar la dirección
      // Por ejemplo, una llamada a una API o un contrato inteligente
      // Por ahora, simplemente simularemos una verificación después de 2 segundos
      const timer = setTimeout(() => {
        setIsAddressVerified(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [address]);

  function generateColor(address: string) {
    const lastTwoDigits = getLastTwoDigits(address);
    const colorValue = parseInt(lastTwoDigits, 16);
    const red = (colorValue * 50) % 256;
    const green = (colorValue * 100) % 256;
    const blue = (colorValue * 150) % 256;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  return (
    <main>
      <div className="profile">
        {isAddressVerified && (
          <div className="container-profile">
            <div
              className="circle-profile"
              style={{ background: generateColor(address as string) }}
            >
              <img src={data?.avatar} />
            </div>
            <div className="name-profile">
              <span>Nombre: {data?.basename}</span>
              <br />
              <br />
              <span>Mi wallet: {address}</span> <br />
              <br />
              <span>Redes sociales</span>
              <div className="social-profile">
                <button
                  className="button-profile"
                  onClick={() => window.open(data.facebook, "_blank")}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    width="25"
                    height="25"
                    data-icon="facebook-f"
                    className=" fa-facebook-f "
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path
                      fill="currentColor"
                      d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                    ></path>
                  </svg>
                </button>
                <button
                  className="button-profile"
                  onClick={() => window.open(data?.instagram, "_blank")}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    width="25"
                    height="25"
                    data-icon="instagram"
                    className=" fa-instagram "
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    ></path>
                  </svg>
                </button>
                <button
                  className="button-profile"
                  onClick={() => window.open(data?.x, "_blank")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
                  </svg>
                </button>
                <br />
                <br />
                {/* {session != null &&
                address.toLowerCase() == session.user?.id?.toLowerCase() && (
                  <button
                    className="button-primary"
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </button>
                )} */}
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-body">
              <h1 style={{ textAlign: "center" }}>Mis redes sociales</h1>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value as `0x${string}`)}
                placeholder="Name"
              />
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="Facebook URL"
              />
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="Instagram URL"
              />
              <input
                type="text"
                value={xUrl}
                onChange={(e) => setXUrl(e.target.value)}
                placeholder="X URL"
              />
              <button
                className="button-primary"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Guardar
              </button>
              <button
                className="button-secondary"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
