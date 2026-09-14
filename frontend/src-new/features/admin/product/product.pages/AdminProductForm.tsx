// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate, useParams } from "react-router-dom";
// import { isAxiosError } from "axios";
// import { z } from "zod";

// import { useAdminProduct, useAdminProductMutations } from "@/features/admin/product/product.hook";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/context/toastContext";
// const productFormSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters").max(100),
//   description: z.string().min(10, "Description must be at least 10 characters").max(2000),
//   price: z.coerce.number().min(0, "Price cannot be negative"),
//   stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
//   category: z.string().min(2, "Category is required").max(50),
//   imagesText: z.string().optional(),
// });

// type ProductFormValues = z.input<typeof productFormSchema>;
// type ProductFormOutput = z.output<typeof productFormSchema>;

// const categories = ["Phones", "Laptops", "Fashion", "Gaming", "Home"];

// const AdminProductForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = !!id;
//   const { showToast } = useToast();

//   const { data: existingProduct, isLoading: isLoadingProduct } = useAdminProduct(id ?? "");
//   const { createProduct, updateProduct, isCreatingProduct, isUpdatingProduct, createProductError, updateProductError } =
//     useAdminProductMutations();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ProductFormValues, any, ProductFormOutput>({
//     resolver: zodResolver(productFormSchema),
//     values: existingProduct?.data
//       ? {
//           name: existingProduct.data.name,
//           description: existingProduct.data.description,
//           price: existingProduct.data.price,
//           stock: existingProduct.data.stock,
//           category: existingProduct.data.category,
//           imagesText: existingProduct.data.images?.join("\n") ?? "",
//         }
//       : undefined,
//     resetOptions: {
//       keepDirtyValues: true,
//     },
//   });

//   // ...rest stays the same (onSubmit, errorMessage, JSX)
//   const onSubmit = async (values: ProductFormOutput) => {
//     const images = values.imagesText
//       ? values.imagesText
//           .split(/[\n,]/)
//           .map((url) => url.trim())
//           .filter(Boolean)
//       : [];

//     const payload = {
//       name: values.name,
//       description: values.description,
//       price: values.price,
//       stock: values.stock,
//       category: values.category,
//       images,
//     };

//    try {
//   if (isEditMode && id) {
//     await updateProduct({ id, payload });
//     showToast(`"${values.name}" has been updated successfully`);
//   } else {
//     await createProduct(payload);
//     showToast(`"${values.name}" has been created successfully`);
//   }

//   navigate("/admin/products");
// } catch {
//   // error handled below
// }
//   };

//   const errorMessage =
//     (isAxiosError(createProductError) && createProductError.response?.data?.message) ||
//     (isAxiosError(updateProductError) && updateProductError.response?.data?.message) ||
//     undefined;

//   if (isEditMode && isLoadingProduct) {
//     return <p className="text-sm text-[#8B8B85]">Loading product...</p>;
//   }

//   return (
//     <div className="mx-auto max-w-xl">
//       <h1 className="font-serif text-2xl text-[#14151A]">
//         {isEditMode ? "Edit product" : "Add product"}
//       </h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
//         <Input
//           label="Name"
//           type="text"
//           id="name"
//           error={errors.name?.message}
//           {...register("name")}
//         />

//         <div>
//           <label htmlFor="description" className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
//             Description
//           </label>
//           <textarea
//             id="description"
//             rows={4}
//             className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#14151A] outline-none focus:border-[#E8682F] ${
//               errors.description ? "border-red-400" : "border-[#E5E2DA]"
//             }`}
//             {...register("description")}
//           />
//           {errors.description && (
//             <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
//           )}
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <Input
//             label="Price (₦)"
//             type="number"
//             id="price"
//             step="0.01"
//             error={errors.price?.message}
//             {...register("price")}
//           />
//           <Input
//             label="Stock"
//             type="number"
//             id="stock"
//             error={errors.stock?.message}
//             {...register("stock")}
//           />
//         </div>

//         <div>
//           <label htmlFor="category" className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
//             Category
//           </label>
//           <select
//             id="category"
//             className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:border-[#E8682F] ${
//               errors.category ? "border-red-400" : "border-[#E5E2DA]"
//             }`}
//             {...register("category")}
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//           {errors.category && (
//             <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="imagesText" className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
//             Image URLs (one per line)
//           </label>
//           <textarea
//             id="imagesText"
//             rows={3}
//             placeholder="https://example.com/image1.jpg"
//             className="mt-1.5 w-full rounded-lg border border-[#E5E2DA] bg-white px-4 py-3 text-sm text-[#14151A] outline-none focus:border-[#E8682F]"
//             {...register("imagesText")}
//           />
//         </div>

//         {errorMessage && (
//           <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
//         )}

//         <div className="mt-2 flex gap-3">
//           <Button type="submit" isLoading={isCreatingProduct || isUpdatingProduct} className="flex-1">
//             {isEditMode ? "Save changes" : "Create product"}
//           </Button>
//           <Button type="button" variant="secondary" onClick={() => navigate("/admin/products")}>
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminProductForm;

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { z } from "zod";

import {
  useAdminProduct,
  useAdminProductMutations,
} from "@/features/admin/product/product.hook";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastContext";
import { uploadToCloudinary } from "@/lib/cloudinary";

const productFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  category: z
    .string()
    .min(2, "Category is required")
    .max(50),
});

type ProductFormValues = z.input<typeof productFormSchema>;
type ProductFormOutput = z.output<typeof productFormSchema>;

type NewImage = {
  file: File;
  preview: string;
};

const categories = [
  "Phones",
  "Laptops",
  "Fashion",
  "Gaming",
  "Home",
];

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = !!id;

  const { showToast } = useToast();

  const {
    data: existingProduct,
    isLoading: isLoadingProduct,
  } = useAdminProduct(id ?? "");

  const {
    createProduct,
    updateProduct,
    isCreatingProduct,
    isUpdatingProduct,
    createProductError,
    updateProductError,
  } = useAdminProductMutations();

  // Existing Cloudinary images already saved on the product
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // New images selected from the computer
  const [newImages, setNewImages] = useState<NewImage[]>([]);

  // Cloudinary upload state
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [imageUploadError, setImageUploadError] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues, any, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),

    values: existingProduct?.data
      ? {
          name: existingProduct.data.name,
          description: existingProduct.data.description,
          price: existingProduct.data.price,
          stock: existingProduct.data.stock,
          category: existingProduct.data.category,
        }
      : undefined,

    resetOptions: {
      keepDirtyValues: true,
    },
  });

  // Load existing images when editing a product
  useEffect(() => {
    if (existingProduct?.data) {
      setExistingImages(existingProduct.data.images ?? []);
    }
  }, [existingProduct]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      newImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [newImages]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      setImageUploadError("Only image files are allowed.");
    } else {
      setImageUploadError(null);
    }

    const selectedImages: NewImage[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...selectedImages]);

    // Allows selecting the same file again later
    event.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      const imageToRemove = prev[index];

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return prev.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  const onSubmit = async (values: ProductFormOutput) => {
    setImageUploadError(null);

    try {
      let uploadedImageUrls: string[] = [];

      /*
       * Upload newly selected images to Cloudinary.
       *
       * Existing images are already URLs, so they don't need
       * to be uploaded again.
       */
      if (newImages.length > 0) {
        setIsUploadingImages(true);

        uploadedImageUrls = await Promise.all(
          newImages.map((image) => uploadToCloudinary(image.file))
        );

        setIsUploadingImages(false);
      }

      /*
       * Existing images that the admin didn't remove
       * + newly uploaded Cloudinary URLs
       */
      const images = [
        ...existingImages,
        ...uploadedImageUrls,
      ];

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        category: values.category,
        images,
      };

      if (isEditMode && id) {
        await updateProduct({
          id,
          payload,
        });

        showToast(`"${values.name}" has been updated successfully`);
      } else {
        await createProduct(payload);

        showToast(`"${values.name}" has been created successfully`);
      }

      navigate("/admin/products");
    } catch (error) {
      setIsUploadingImages(false);

      if (
        error instanceof Error &&
        error.message.includes("Cloudinary")
      ) {
        setImageUploadError(error.message);
      }
    }
  };

  const errorMessage =
    (isAxiosError(createProductError) &&
      createProductError.response?.data?.message) ||
    (isAxiosError(updateProductError) &&
      updateProductError.response?.data?.message) ||
    undefined;

  const isSubmitting =
    isCreatingProduct ||
    isUpdatingProduct ||
    isUploadingImages;

  if (isEditMode && isLoadingProduct) {
    return (
      <p className="text-sm text-[#8B8B85]">
        Loading product...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-serif text-2xl text-[#14151A]">
        {isEditMode ? "Edit product" : "Add product"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        {/* Name */}
        <Input
          label="Name"
          type="text"
          id="name"
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={4}
            className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#14151A] outline-none focus:border-[#E8682F] ${
              errors.description
                ? "border-red-400"
                : "border-[#E5E2DA]"
            }`}
            {...register("description")}
          />

          {errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (₦)"
            type="number"
            id="price"
            step="0.01"
            error={errors.price?.message}
            {...register("price")}
          />

          <Input
            label="Stock"
            type="number"
            id="stock"
            error={errors.stock?.message}
            {...register("stock")}
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]"
          >
            Category
          </label>

          <select
            id="category"
            className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:border-[#E8682F] ${
              errors.category
                ? "border-red-400"
                : "border-[#E5E2DA]"
            }`}
            {...register("category")}
          >
            <option value="">Select a category</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="mt-1 text-xs text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Product Images */}
        <div>
          <label
            htmlFor="product-images"
            className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]"
          >
            Product images
          </label>

          <div className="mt-1.5 rounded-lg border border-dashed border-[#E5E2DA] bg-white p-4">
            <label
              htmlFor="product-images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg bg-[#FAF8F4] px-4 py-8 text-center transition hover:bg-[#F7F4EE]"
            >
              <span className="text-sm font-medium text-[#14151A]">
                Choose images
              </span>

              <span className="mt-1 text-xs text-[#8B8B85]">
                PNG, JPG, JPEG or WEBP
              </span>

              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            </label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-[#8B8B85]">
                  Current images
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-lg border border-[#E5E2DA] bg-[#F0EDE6]"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(index)
                        }
                        disabled={isSubmitting}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white transition hover:bg-red-500 disabled:opacity-50"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images */}
            {newImages.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-[#8B8B85]">
                  New images
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {newImages.map((image, index) => (
                    <div
                      key={`${image.file.name}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-lg border border-[#E5E2DA] bg-[#F0EDE6]"
                    >
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        disabled={isSubmitting}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white transition hover:bg-red-500 disabled:opacity-50"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {imageUploadError && (
            <p className="mt-1 text-xs text-red-500">
              {imageUploadError}
            </p>
          )}
        </div>

        {/* API error */}
        {errorMessage && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-2 flex gap-3">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="flex-1"
          >
            {isUploadingImages
              ? "Uploading images..."
              : isEditMode
                ? "Save changes"
                : "Create product"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/products")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;