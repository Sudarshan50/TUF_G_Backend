import e from "express";
import { createPass, downloadVoucher } from "../controller/passController.js";

const router = e.Router();
router.post("/", createPass);
router.get("/voucher/:ticketNumber", downloadVoucher);

export default router;
