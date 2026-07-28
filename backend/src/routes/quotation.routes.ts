import { Router } from "express";
import { QuotationController } from "../controllers/quotation.controller";
import { authenticate, requirePermissions } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  addQuotationConversationSchema,
  assignQuotationSchema,
  createQuotationSchema,
  quotationIdParamSchema,
  quotationListSchema,
  updateQuotationSchema,
  updateQuotationStatusSchema
} from "../validators/quotation.validator";

export const quotationRouter = Router();
export const adminQuotationRouter = Router();

const controller = new QuotationController();

quotationRouter.post("/", validate(createQuotationSchema), asyncHandler(controller.submit));

adminQuotationRouter.use(authenticate);
adminQuotationRouter.get(
  "/",
  requirePermissions("quotations:read"),
  validate(quotationListSchema),
  asyncHandler(controller.list)
);
adminQuotationRouter.get(
  "/export.csv",
  requirePermissions("quotations:export"),
  validate(quotationListSchema),
  asyncHandler(controller.exportCsv)
);
adminQuotationRouter.get(
  "/stats",
  requirePermissions("quotations:read"),
  asyncHandler(controller.stats)
);
adminQuotationRouter.get(
  "/sales-executives",
  requirePermissions("quotations:assign"),
  asyncHandler(controller.salesExecutives)
);
adminQuotationRouter.get(
  "/:id",
  requirePermissions("quotations:read"),
  validate(quotationIdParamSchema),
  asyncHandler(controller.get)
);
adminQuotationRouter.patch(
  "/:id",
  requirePermissions("quotations:update"),
  validate(quotationIdParamSchema),
  validate(updateQuotationSchema),
  asyncHandler(controller.update)
);
adminQuotationRouter.patch(
  "/:id/assign",
  requirePermissions("quotations:assign"),
  validate(quotationIdParamSchema),
  validate(assignQuotationSchema),
  asyncHandler(controller.assign)
);
adminQuotationRouter.patch(
  "/:id/status",
  requirePermissions("quotations:update"),
  validate(quotationIdParamSchema),
  validate(updateQuotationStatusSchema),
  asyncHandler(controller.changeStatus)
);
adminQuotationRouter.get(
  "/:id/conversations",
  requirePermissions("quotations:read"),
  validate(quotationIdParamSchema),
  asyncHandler(controller.conversations)
);
adminQuotationRouter.post(
  "/:id/conversations",
  requirePermissions("quotations:update"),
  validate(quotationIdParamSchema),
  validate(addQuotationConversationSchema),
  asyncHandler(controller.addConversation)
);
adminQuotationRouter.delete(
  "/:id",
  requirePermissions("quotations:delete"),
  validate(quotationIdParamSchema),
  asyncHandler(controller.delete)
);

export default quotationRouter;
