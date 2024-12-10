import fs from "fs";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import Pass from "../model/pass.js";
import generateTicketNumber from "../utils/genTicketNumber.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const createPass = async (req, res) => {
  try {
    const ticketNumber = generateTicketNumber();
    const pass = await Pass.create({ ticketNumber, expiryDate: null });

    const qrCodeDataUrl = await QRCode.toDataURL(ticketNumber, {
      color: {
        dark: "#00DDFF", // White color for QR code
        light: "#00000000", // Transparent background
      },
    });

    const templatePath = "templates/voucher.pdf";
    const templateBuffer = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBuffer);

    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    firstPage.drawImage(qrImage, {
      x: width - 217,
      y: height - 172,
      width: 120,
      height: 120,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const pdfPath = `vouchers/voucher-${ticketNumber}.pdf`;
    fs.writeFileSync(pdfPath, modifiedPdfBytes);

    return successResponse(res, "Pass created successfully", {
      pass,
      downloadUrl: `${req.protocol}://${req.get(
        "host"
      )}/api/passes/voucher/${ticketNumber}`,
    });
  } catch (error) {
    console.error(error.message);
    return errorResponse(res, "Failed to create pass", error.message, 500);
  }
};

export const downloadVoucher = (req, res) => {
  const { ticketNumber } = req.params;
  const pdfPath = `vouchers/voucher-${ticketNumber}.pdf`;

  if (fs.existsSync(pdfPath)) {
    res.download(pdfPath, `voucher-${ticketNumber}.pdf`, (err) => {
      if (err) {
        console.error(err);
        return errorResponse(
          res,
          "Failed to download voucher",
          err.message,
          500
        );
      }
    });
  } else {
    return errorResponse(res, "Voucher not found", null, 404);
  }
};

