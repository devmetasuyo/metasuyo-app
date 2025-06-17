import axios, { AxiosError } from "axios";
import { readFile, writeFile } from "fs/promises";
import JSZip from "jszip";
import { join } from "path";

const SUNAT_BETA_URL = process.env.SUNAT_URL;

export class SunatService {
  private credentials: {
    username: string;
    password: string;
  };

  constructor(username: string, password: string) {
    this.credentials = {
      username,
      password,
    };
  }

  async sendBill({ name }: { name: string }) {
    const pathToSaveOrRead = join(
      process.cwd(),
      "public",
      "sunat",
      "invoices",
      name,
      name
    );

    try {
      const xmlContent = await readFile(pathToSaveOrRead.concat(".xml"));

      const zip = new JSZip();

      zip.file(name.concat(".xml"), xmlContent);

      const nodebuffer = await zip.generateAsync({ type: "nodebuffer" });

      await writeFile(pathToSaveOrRead.concat(".zip"), nodebuffer);

      const contentBase64 = nodebuffer.toString("base64");

      const soapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.sunat.gob.pe" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><soapenv:Header><wsse:Security><wsse:UsernameToken><wsse:Username>${this.credentials.username}</wsse:Username><wsse:Password>${this.credentials.password}</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><ser:sendBill><fileName>${name.concat(".zip")}</fileName><contentFile>${contentBase64}</contentFile></ser:sendBill></soapenv:Body></soapenv:Envelope>`;

      const response = await axios.post(`${SUNAT_BETA_URL}`, soapEnvelope, {
        headers: {
          "Content-Type": "text/xml",
        },
      });

      if (response.statusText !== "OK") {
        writeFile(pathToSaveOrRead.concat("-error.xml"), response.data);

        throw new AxiosError(response.statusText);
      }

      writeFile(pathToSaveOrRead.concat("-ticket.xml"), response.data);

      return {
        status: {
          statusCode: "OK",
          statusMessage: "La Factura " + name + ", ha sido aceptada",
        },
        cdr: response.data,
        xml: xmlContent.toString(),
      };
    } catch (error) {
      console.error("Error enviando documento a SUNAT:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Error de SUNAT: ${error.response?.data || error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Consulta el estado de un documento
   */
  async getStatus(ticket: string) {
    // try {
    //   const client = await createClientAsync(SUNAT_BETA_URL);
    //   client.setSecurity(
    //     new (client as any).BasicAuthSecurity(
    //       this.credentials.username,
    //       this.credentials.password
    //     )
    //   );
    //   const [result] = await client.getStatusAsync({
    //     ticket,
    //   });
    //   return result;
    // } catch (error) {
    //   console.error("Error consultando estado en SUNAT:", error);
    //   throw error;
    // }
  }

  /**
   * Envía un resumen diario
   */
  async sendSummary(xmlContent: string, filename: string) {
    // try {
    //   const zip = new JSZip();
    //   zip.file(filename, xmlContent);
    //   const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    //   const client = await createClientAsync(SUNAT_BETA_URL);
    //   client.setSecurity(
    //     new (client as any).BasicAuthSecurity(
    //       this.credentials.username,
    //       this.credentials.password
    //     )
    //   );
    //   const [result] = await client.sendSummaryAsync({
    //     fileName: `${filename}.zip`,
    //     contentFile: zipContent.toString("base64"),
    //   });
    //   return result;
    // } catch (error) {
    //   console.error("Error enviando resumen a SUNAT:", error);
    //   throw error;
    // }
  }

  /**
   * Consulta el estado de un documento AR (Resumen)
   */
  async getStatusAR(ticket: string) {
    // try {
    //   const client = await createClientAsync(SUNAT_BETA_URL);
    //   client.setSecurity(
    //     new (client as any).BasicAuthSecurity(
    //       this.credentials.username,
    //       this.credentials.password
    //     )
    //   );
    //   const [result] = await client.getStatusARAsync({
    //     ticket,
    //   });
    //   return result;
    // } catch (error) {
    //   console.error("Error consultando estado AR en SUNAT:", error);
    //   throw error;
    // }
  }

  /**
   * Envía un paquete de documentos
   */
  async sendPack(xmlContents: { content: string; filename: string }[]) {
    //   try {
    //     const zip = new JSZip();
    //     xmlContents.forEach(({ content, filename }) => {
    //       zip.file(filename, content);
    //     });
    //     const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    //     const client = await createClientAsync(SUNAT_BETA_URL);
    //     client.setSecurity(
    //       new (client as any).BasicAuthSecurity(
    //         this.credentials.username,
    //         this.credentials.password
    //       )
    //     );
    //     const [result] = await client.sendPackAsync({
    //       fileName: "documentos.zip",
    //       contentFile: zipContent.toString("base64"),
    //     });
    //     return result;
    //   } catch (error) {
    //     console.error("Error enviando paquete a SUNAT:", error);
    //     throw error;
    //   }
    // }
  }
}
