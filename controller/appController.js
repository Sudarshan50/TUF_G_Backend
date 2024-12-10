let appApi = {};
import axios from "axios";
import Pass from "../model/pass.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

appApi.generateVouchers = async (req, res) => {
  try {
    const count = req.body.count;
    for (let i = 0; i < count; i++) {
      await axios.post(`http://localhost:4000/api/pass/`).then((res) => {
        if (res.status === 200) {
          console.log("Voucher generated successfully Count: ", i + 1);
        } else {
          console.log("Failed to generate voucher");
        }
      });
    }
    return successResponse(res, "Vouchers generated successfully");
  } catch (err) {
    console.error(err.message);
    return errorResponse(res, "Failed to generate vouchers", err.message, 500);
  }
};

appApi.getVouncherData = async (req, res) => {
  try {
    const id = req.params.id;
    const pass = await Pass.findOne({ ticketNumber: id });
    if (!pass) {
      return errorResponse(res, "Voucher not found", "Voucher not found", 404);
    }
    return successResponse(res, "Voucher data fetched successfully", pass);
  } catch (er) {
    console.error(err.message);
    errorResponse(res, "Failed to get voucher data", err.message, 500);
  }
};

appApi.validateVoucher = async (req, res) => {
  try {
    const passId = req.body.passId;
    if (!passId) {
      return errorResponse(res, "PassId is required", {}, 400);
    }
    const pass = await Pass.findOne({ ticketNumber: passId });
    if (!pass) {
      return errorResponse(res, "Voucher not found", {}, 404);
    }
    if (pass.isUsed) {
      return errorResponse(res, "Voucher already used", {}, 400);
    }
    pass.isScanned = true;
    await pass.save();
    return successResponse(res, "Voucher validated successfully");
  } catch (err) {
    console.log(err.message);
    errorResponse(res, "Failed to validate voucher", err.message, 500);
  }
};

appApi.getAnalytics = async (req, res) => {
  try {
    const VoucherData = await Pass.find();
    if (VoucherData.length === 0) {
      return errorResponse(res, "No Voucher found", {}, 404);
    }
    const usedPass = VoucherData.filter((pass) => pass.isScanned);
    const totalPass = VoucherData.length;
    const usedPassCount = usedPass.length;
    const unusedPassCount = totalPass - usedPassCount;

    return successResponse(res, "Analytics fetched successfully", {
      total: totalPass,
      used: usedPassCount,
      unused: unusedPassCount,
    });
  } catch (err) {
    console.log(err.message);
    errorResponse(res, "Failed to get voucher details", err.message, 500);
  }
};

export default appApi;
