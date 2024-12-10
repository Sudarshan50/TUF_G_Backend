import express from "express";
import appApi from "../controller/appController.js";

const appRouter = express.Router();

appRouter.get('/analytics',appApi.getAnalytics);
appRouter.post("/genVouchers", appApi.generateVouchers);
appRouter.get("/voucher/:id", appApi.getVouncherData);
appRouter.post("/voucher", appApi.validateVoucher);
export default appRouter;
