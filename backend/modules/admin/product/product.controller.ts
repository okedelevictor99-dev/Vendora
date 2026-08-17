import { asyncHandler } from "@/utils/asyncHandler";
import { Response,Request } from "express";
import { sendResponse } from "@/utils/response";
import { createProductService,getAdminProductByIdService,getAdminProductsService,updateProductService,activateProductService,deactivateProductService } from "./product.service";


export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = req.validatedBody;
  const product = await createProductService(data);
  return sendResponse(res, 201, "Product created successfully", product);
});

export const getAdminProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAdminProductsService(req.query);

    return sendResponse(
      res,
      200,
      "Products fetched successfully",
      result
    );
  }
);
export const getAdminProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams;
  const product = await getAdminProductByIdService(id);
  return sendResponse(res, 200, "Product fetched successfully", product);
});
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams;
  const data = req.validatedBody;
  const product = await updateProductService(id, data);
  return sendResponse(res, 200, "Product updated successfully", product);
});

export const deactivateProduct = asyncHandler(
  async (req: Request, res: Response) => {
     const { id } = req.validatedParams;
    const result = await deactivateProductService(id);

    return sendResponse(
      res,
      200,
      "Product deactivated successfully",
      result
    );
  }
);

export const activateProduct = asyncHandler(
  async (req: Request, res: Response) => {
     const { id } = req.validatedParams;
    const result = await activateProductService(id);

    return sendResponse(
      res,
      200,
      "Product activated successfully",
      result
    );
  }
);
