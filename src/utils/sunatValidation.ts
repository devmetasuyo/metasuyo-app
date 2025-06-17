import { SignedXml } from "xml-crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import Big from "big.js";
import { mkdir } from "fs/promises";
import { join } from "path";

interface SUNATValidationConfig {
  rucEmisor: string;
  clientId: string;
  usuarioSol: string;
  claveSol: string;
  razonSocialEmisor: string;
  certificadoDigital: string;
  clavePrivada: string;
  moneda: string;
}

interface ProductoFactura {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  igv: number;
}

interface Cliente {
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
}

export interface FacturaData {
  serie: string;
  correlativo: string;
  fechaEmision: Date;
  cliente: Cliente;
  productos: ProductoFactura[];
  totalVenta: number;
  totalIGV: number;
  moneda: string;
}

export class SUNATValidator {
  private config: SUNATValidationConfig;
  private currentFactura?: FacturaData;
  public pathToSave: string = process.cwd();
  public filename: string = "factura";
  constructor(config: SUNATValidationConfig) {
    this.config = config;
  }

  public async generateToken() {
    try {
      const formData = new FormData();

      formData.append("grant_type", "password");
      formData.append("scoope", "https://api-cpe.sunat.gob.pe");
      formData.append("client_id", this.config.clientId);
      formData.append("client_secret", this.config.clavePrivada);
      formData.append(
        "username",
        this.config.rucEmisor + this.config.usuarioSol
      );
      formData.append("password", this.config.claveSol);

      const response = await fetch(
        `https://api-seguridad.sunat.gob.pe/v1/clientessol/${this.config.clientId}/oauth2/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "password",
            scoope: "https://api-cpe.sunat.gob.pe",
            client_id: this.config.clientId,
            client_secret: this.config.clavePrivada,
            username: this.config.rucEmisor + this.config.usuarioSol,
            password: this.config.claveSol,
          }),
        }
      );

      const data = await response.json();

      console.log(data);
    } catch (e) {
      return { error: "Error al generar el token" };
    }
  }

  /**
   * Valida el RUC usando el algoritmo de SUNAT
   */
  public validarRUC(ruc: string): boolean {
    if (!/^[0-9]{11}$/.test(ruc)) {
      return false;
    }

    const factor = "5432765432";
    let sum = 0;

    for (let i = 0; i < factor.length; i++) {
      sum += parseInt(ruc.charAt(i)) * parseInt(factor.charAt(i));
    }

    const resto = 11 - (sum % 11);
    const digit = resto === 11 ? 0 : resto === 10 ? 0 : resto;

    return parseInt(ruc.charAt(10)) === digit;
  }

  /**
   * Valida la serie según el tipo de documento
   */
  public validarSerie(serie: string, tipoDocumento: string): boolean {
    // Factura electrónica: F[A-Z][0-9]{3}
    if (tipoDocumento === "01") {
      return /^F[A-Z][0-9]{3}$/.test(serie);
    }
    // Boleta electrónica: B[A-Z][0-9]{3}
    if (tipoDocumento === "03") {
      return /^B[A-Z][0-9]{3}$/.test(serie);
    }
    // Nota de crédito: F[A-Z][0-9]{3} o B[A-Z][0-9]{3}
    if (tipoDocumento === "07") {
      return /^[FB][A-Z][0-9]{3}$/.test(serie);
    }
    return false;
  }

  /**
   * Genera el XML en formato UBL 2.1
   */
  public async generarXML(factura: FacturaData) {
    const fullPath = join(this.pathToSave, this.filename);

    const existFolder = existsSync(fullPath);

    if (!existFolder)
      await mkdir(fullPath, {
        recursive: true,
      });

    const data = {
      ID: `${factura.serie}-${factura.correlativo}`,
      IssueDate: factura.fechaEmision.toISOString().split("T")[0],
      IssueTime: factura.fechaEmision
        .toISOString()
        .split("T")[1]
        .substring(0, 8),
      Note: "Monto en Palabras",
      Moneda: factura.moneda,
      RucEmisor: this.config.rucEmisor,
      NombreEmisor: this.config.razonSocialEmisor,
      DireccionEmisor:
        "AV. PRIMAVERA NRO. 2010 DPTO. 801 C.H. LIMA POLO HUNT CLUB LIMA",
      DistritoEmisor: "SANTIAGO DE SURCO",
      CiudadEmisor: "LIMA",
      RucCliente: factura.cliente.numeroDocumento,
      NombreCliente: factura.cliente.razonSocial,
    };

    const invoiceLine = factura.productos.map(
      (item, index) => `<cac:InvoiceLine>
          <cbc:ID>${(index + 1).toString()}</cbc:ID>
          <cbc:InvoicedQuantity unitCode="NIU">${item.cantidad}</cbc:InvoicedQuantity>
          <cbc:LineExtensionAmount currencyID="${factura.moneda}">${item.precioUnitario.toFixed(2)}</cbc:LineExtensionAmount>
          <cac:PricingReference>
              <cac:AlternativeConditionPrice>
                  <cbc:PriceAmount currencyID="${factura.moneda}">${(item.precioUnitario * 1.18).toFixed(2)}</cbc:PriceAmount>
                  <cbc:PriceTypeCode listAgencyName="PE:SUNAT" listName="Tipo de precio" listURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16">01</cbc:PriceTypeCode>
              </cac:AlternativeConditionPrice>
          </cac:PricingReference>
          <cac:TaxTotal>
              <cbc:TaxAmount currencyID="${data.Moneda}">${item.igv.toFixed(2)}</cbc:TaxAmount>
              <cac:TaxSubtotal>
                  <cbc:TaxableAmount currencyID="${factura.moneda}">${item.precioUnitario.toFixed(2)}</cbc:TaxableAmount>
                  <cbc:TaxAmount currencyID="${factura.moneda}">${item.igv.toFixed(2)}</cbc:TaxAmount>
                  <cac:TaxCategory>
                      <cbc:Percent>18</cbc:Percent>
                      <cbc:TaxExemptionReasonCode>10</cbc:TaxExemptionReasonCode>
                      <cac:TaxScheme>
                          <cbc:ID>1000</cbc:ID>
                          <cbc:Name>IGV</cbc:Name>
                          <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                      </cac:TaxScheme>
                  </cac:TaxCategory>
              </cac:TaxSubtotal>
          </cac:TaxTotal>
          <cac:Item>
              <cbc:Description>${item.descripcion}</cbc:Description>
          </cac:Item>
          <cac:Price>
              <cbc:PriceAmount currencyID="${factura.moneda}">${item.precioUnitario.toFixed(2)}</cbc:PriceAmount>
          </cac:Price>
      </cac:InvoiceLine>`
    );

    // "cac:LegalMonetaryTotal": {
    //   "cbc:LineExtensionAmount": {
    //     "@_currencyID": factura.moneda,
    //     "#text": (factura.totalVenta - factura.totalIGV).toFixed(2),
    //   },
    //   "cbc:TaxInclusiveAmount": {
    //     "@_currencyID": factura.moneda,
    //     "#text": factura.totalVenta.toFixed(2),
    //   },
    //   "cbc:PayableAmount": {
    //     "@_currencyID": factura.moneda,
    //     "#text": factura.totalVenta.toFixed(2),
    //   },
    // },

    const builder = `<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
  <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
      xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
      xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
      xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
      xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
      <ext:UBLExtensions>
          <ext:UBLExtension>
              <ext:ExtensionContent>
              </ext:ExtensionContent>
          </ext:UBLExtension>
      </ext:UBLExtensions>
      <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
      <cbc:CustomizationID>2.0</cbc:CustomizationID>
      <cbc:ID>${data.ID}</cbc:ID>
      <cbc:IssueDate>${data.IssueDate}</cbc:IssueDate>
      <cbc:IssueTime>${data.IssueTime}</cbc:IssueTime>
      <cbc:InvoiceTypeCode listID="0101">01</cbc:InvoiceTypeCode>
      <cbc:Note languageLocaleID="1000">${data.Note}</cbc:Note>
      <cbc:DocumentCurrencyCode listAgencyName="United Nations Economic Commission for Europe" listID="ISO 4217 Alpha" listName="Currency">${data.Moneda}</cbc:DocumentCurrencyCode>
      <cac:AccountingSupplierParty>
          <cac:Party>
              <cac:PartyIdentification>
                  <cbc:ID schemeAgencyName="PE:SUNAT" schemeID="6" schemeName="Documento de Identidad" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06">${data.RucEmisor}</cbc:ID>
              </cac:PartyIdentification>
              <cac:PartyName>
                  <cbc:Name>${data.NombreEmisor}</cbc:Name>
              </cac:PartyName>
              <cac:PartyLegalEntity>
                  <cbc:RegistrationName>${data.NombreEmisor}</cbc:RegistrationName>
                  <cac:RegistrationAddress>
                      <cbc:ID schemeAgencyName="PE:INEI" schemeName="Ubigeos">150114</cbc:ID>
                      <cbc:AddressTypeCode listAgencyName="PE:SUNAT" listName="Establecimiento anexos">0000</cbc:AddressTypeCode>
                      <cbc:CityName>${data.CiudadEmisor}</cbc:CityName>
                      <cbc:CountrySubentity>${data.CiudadEmisor}</cbc:CountrySubentity>
                      <cbc:District>${data.DistritoEmisor}</cbc:District>
                      <cac:AddressLine>
                          <cbc:Line>${data.DireccionEmisor}</cbc:Line>
                      </cac:AddressLine>
                      <cac:Country>
                          <cbc:IdentificationCode listAgencyName="United Nations Economic Commission for Europe" listID="ISO 3166-1" listName="Country">PE</cbc:IdentificationCode>
                      </cac:Country>
                  </cac:RegistrationAddress>
              </cac:PartyLegalEntity>
          </cac:Party>
      </cac:AccountingSupplierParty>
      <cac:AccountingCustomerParty>
          <cac:Party>
              <cac:PartyIdentification>
                  <cbc:ID schemeAgencyName="PE:SUNAT" schemeID="${factura.cliente.tipoDocumento}">${data.RucCliente}</cbc:ID>
              </cac:PartyIdentification>
              <cac:PartyLegalEntity>
                  <cbc:RegistrationName>${data.NombreCliente}</cbc:RegistrationName>
              </cac:PartyLegalEntity>
          </cac:Party>
      </cac:AccountingCustomerParty>
      <cac:PaymentTerms>
          <cbc:ID>FormaPago</cbc:ID>
          <cbc:PaymentMeansID>Contado</cbc:PaymentMeansID>
      </cac:PaymentTerms>
      <cac:TaxTotal>
          <cbc:TaxAmount currencyID="${factura.moneda}">${factura.totalIGV.toFixed(2)}</cbc:TaxAmount>
          <cac:TaxSubtotal>
              <cbc:TaxableAmount currencyID="${factura.moneda}">${factura.totalVenta.toFixed(2)}</cbc:TaxableAmount>
              <cbc:TaxAmount currencyID="${factura.moneda}">${factura.totalIGV.toFixed(2)}</cbc:TaxAmount>
              <cac:TaxCategory>
                  <cac:TaxScheme>
                      <cbc:ID schemeAgencyName="PE:SUNAT" schemeName="Codigo de tributos" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo:05">1000</cbc:ID>
                      <cbc:Name>IGV</cbc:Name>
                      <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                  </cac:TaxScheme>
              </cac:TaxCategory>
          </cac:TaxSubtotal>
      </cac:TaxTotal>
      <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="${factura.moneda}">${factura.totalVenta.toFixed(2)}</cbc:LineExtensionAmount>
          <cbc:TaxInclusiveAmount currencyID="${factura.moneda}">${(factura.totalVenta * 1.18).toFixed(2)}</cbc:TaxInclusiveAmount>
          <cbc:PayableAmount currencyID="${factura.moneda}">${(factura.totalVenta * 1.18).toFixed(2)}</cbc:PayableAmount>
      </cac:LegalMonetaryTotal>
      ${invoiceLine}
  </Invoice>`;

    writeFileSync(
      join(fullPath, this.filename.concat("-sin-firma.xml")),
      builder,
      {
        encoding: "utf-8",
      }
    );
  }

  public firmarXML() {
    const fullPath = join(this.pathToSave, this.filename);

    try {
      const certificado = readFileSync("private.pem");
      const certificadoPublico = readFileSync("certificate.pem");

      const xml = readFileSync(
        join(fullPath, this.filename.concat("-sin-firma.xml")),
        {
          encoding: "utf-8",
        }
      );

      const sig = new SignedXml({
        privateKey: certificado,
        publicCert: certificadoPublico,
      });

      sig.addReference({
        xpath: "//*[local-name(.)='Invoice']",
        digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
        transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"],
        uri: "",
        isEmptyUri: true,
      });

      sig.canonicalizationAlgorithm =
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments";
      sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

      sig.computeSignature(xml, {
        location: {
          reference: "//*[local-name(.)='ExtensionContent']",
          action: "prepend",
        },
        prefix: "ds",
        attrs: { Id: "SignatureSP" },
      });

      const signedXml = sig.getSignedXml();

      const signatureVerification = new SignedXml({
        publicCert: certificadoPublico,
      });

      signatureVerification.loadSignature(sig.getSignatureXml());

      const valid = signatureVerification.checkSignature(signedXml);

      if (!valid) throw new Error("Error al firma el xml");

      writeFileSync(join(fullPath, this.filename.concat(".xml")), signedXml);
    } catch (error) {
      console.error("Error al firmar XML:", error);
      throw new Error(
        `Error al firmar XML: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  private calcularTotalGravado(): number {
    if (!this.currentFactura) {
      return 0;
    }
    return this.currentFactura.totalVenta / 1.18;
  }

  public prepararFactura(facturaData: FacturaData): void {
    this.currentFactura = facturaData;
  }

  public calcularTotales(productos: ProductoFactura[]) {
    let totalVenta = new Big(0);
    let totalIGV = new Big(0);

    productos.forEach((producto) => {
      const subtotal = new Big(producto.precioUnitario).mul(producto.cantidad);
      const igv = subtotal.mul(0.18);

      totalVenta = totalVenta.add(subtotal);
      totalIGV = totalIGV.add(igv);
    });

    return {
      totalVenta: totalVenta.toNumber(),
      totalIGV: totalIGV.toNumber(),
      totalGeneral: totalVenta.add(totalIGV).toNumber(),
    };
  }

  public validarNotaCredito(
    notaCredito: FacturaData,
    facturaOriginal: FacturaData
  ): boolean {
    // Validar que la factura original exista
    if (!facturaOriginal) {
      return false;
    }

    // Validar que el monto de la nota no exceda el de la factura
    if (notaCredito.totalVenta > facturaOriginal.totalVenta) {
      return false;
    }

    // Validar que la fecha de la nota sea posterior a la factura
    if (notaCredito.fechaEmision <= facturaOriginal.fechaEmision) {
      return false;
    }

    return true;
  }

  public validarFechaEmision(fechaEmision: Date): boolean {
    const hoy = new Date();
    const diferenciaDias = Math.abs(
      (hoy.getTime() - fechaEmision.getTime()) / (1000 * 3600 * 24)
    );

    if (diferenciaDias > 7) {
      return false;
    }

    return true;
  }

  public async validarComprobante(factura: FacturaData): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // 1. Validar RUC del emisor
    if (!this.validarRUC(this.config.rucEmisor)) {
      errors.push("RUC del emisor inválido");
    }

    // 2. Validar serie según tipo de documento
    if (!this.validarSerie(factura.serie, "01")) {
      errors.push("Serie de factura inválida");
    }

    // 3. Validar fecha de emisión
    if (!this.validarFechaEmision(factura.fechaEmision)) {
      errors.push("Fecha de emisión inválida");
    }

    // 4. Validar totales
    const totales = this.calcularTotales(factura.productos);
    if (Math.abs(totales.totalGeneral - factura.totalVenta) > 0.01) {
      errors.push("Los totales no coinciden");
    }

    // 5. Generar y firmar XML si todo es válido
    if (errors.length === 0) {
      try {
        this.generarXML(factura);
        this.firmarXML();
      } catch (error) {
        errors.push("Error al generar o firmar el XML");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
