import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { z } from "zod";

import { useAdminProduct, useAdminProductMutations } from "@/features/admin/product/product.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastContext";
const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  category: z.string().min(2, "Category is required").max(50),
  imagesText: z.string().optional(),
});

type ProductFormValues = z.input<typeof productFormSchema>;
type ProductFormOutput = z.output<typeof productFormSchema>;

const categories = ["Phones", "Laptops", "Fashion", "Gaming", "Home"];

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { showToast } = useToast();

  const { data: existingProduct, isLoading: isLoadingProduct } = useAdminProduct(id ?? "");
  const { createProduct, updateProduct, isCreatingProduct, isUpdatingProduct, createProductError, updateProductError } =
    useAdminProductMutations();

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
          imagesText: existingProduct.data.images?.join("\n") ?? "",
        }
      : undefined,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  // ...rest stays the same (onSubmit, errorMessage, JSX)
  const onSubmit = async (values: ProductFormOutput) => {
    const images = values.imagesText
      ? values.imagesText
          .split(/[\n,]/)
          .map((url) => url.trim())
          .filter(Boolean)
      : [];

    const payload = {
      name: values.name,
      description: values.description,
      price: values.price,
      stock: values.stock,
      category: values.category,
      images,
    };

   try {
  if (isEditMode && id) {
    await updateProduct({ id, payload });
    showToast(`"${values.name}" has been updated successfully`);
  } else {
    await createProduct(payload);
    showToast(`"${values.name}" has been created successfully`);
  }

  navigate("/admin/products");
} catch {
  // error handled below
}
  };

  const errorMessage =
    (isAxiosError(createProductError) && createProductError.response?.data?.message) ||
    (isAxiosError(updateProductError) && updateProductError.response?.data?.message) ||
    undefined;

  if (isEditMode && isLoadingProduct) {
    return <p className="text-sm text-[#8B8B85]">Loading product...</p>;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-serif text-2xl text-[#14151A]">
        {isEditMode ? "Edit product" : "Add product"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input
          label="Name"
          type="text"
          id="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label htmlFor="description" className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#14151A] outline-none focus:border-[#E8682F] ${
              errors.description ? "border-red-400" : "border-[#E5E2DA]"
            }`}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

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

        <div>
          <label htmlFor="category" className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
            Category
          </label>
          <select
            id="category"
            className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:border-[#E8682F] ${
              errors.category ? "border-red-400" : "border-[#E5E2DA]"
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
            <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="imagesText" className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
            Image URLs (one per line)
          </label>
          <textarea
            id="imagesText"
            rows={3}
            placeholder="https://example.com/image1.jpg"
            className="mt-1.5 w-full rounded-lg border border-[#E5E2DA] bg-white px-4 py-3 text-sm text-[#14151A] outline-none focus:border-[#E8682F]"
            {...register("imagesText")}
          />
        </div>

        {errorMessage && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
        )}

        <div className="mt-2 flex gap-3">
          <Button type="submit" isLoading={isCreatingProduct || isUpdatingProduct} className="flex-1">
            {isEditMode ? "Save changes" : "Create product"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;