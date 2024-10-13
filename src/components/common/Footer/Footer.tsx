import textos from "@/utils/text.json";
import {
  FaFacebookF,
  FaGooglePlusG,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import "./Footer.scss";

export function Footer() {
  return (
    <footer>
      <div className="footer">
        <div>
          <img className="footerIcon" src="/icon-big.png" alt="logo" />
        </div>
        <div>
          <p className="footertitle">{textos.footer.title}</p>
          <span className="footerSpan">{textos.footer.span}</span>
        </div>
        <div className="redesM">
          <ul>
            <li>
              <a
                href="https://www.facebook.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/user/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/metasuyo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a
                href="mailto:contacto.metasuyo@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGooglePlusG />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footerDerechosDiv">
        <span className="footerDerechos">{textos.footer.copyright}</span>
      </div>
    </footer>
  );
}
