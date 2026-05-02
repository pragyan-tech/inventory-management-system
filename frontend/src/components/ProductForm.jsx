import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/categories";
import Input from "./Input";
import Button from "./Button";
import ImageUpload from "./ImageUpload";

const productSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(50, "SKU too long"),
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  description: z.string().max(255, "Description too long").optional(),
  unitPrice: z.coerce.number().min(0, "Price must be positive"),
  unitsInStock: z.coerce.number().int("Must be a whole number").min(0, "Cannot be negative"),
  categoryId: z.coerce.number().int().min(1, "Please select a category"),
  imageUrl: z.string().nullable().optional(),
});

export default function ProductForm({ initialValues, onSubmit, onCancel, submitLabel = "Save" }) {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      sku: "",
      name: "",
      description: "",
      unitPrice: 0,
      unitsInStock: 0,
      categoryId: "",
      imageUrl: null,
    },
  });

  const handleFormSubmit = async (data) => {
    const payload = {
      ...(initialValues?.id && { id: initialValues.id }),
      sku: data.sku,
      name: data.name,
      description: data.description || "",
      unitPrice: data.unitPrice,
      unitsInStock: data.unitsInStock,
      imageUrl: data.imageUrl || null,
      category: { id: data.categoryId },
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="SKU"
          placeholder="LP-100"
          {...register("sku")}
          error={errors.sku?.message}
        />
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Category
          </label>
          <select
            {...register("categoryId")}
            disabled={categoriesLoading}
            className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              errors.categoryId ? "border-red-500" : "border-slate-700"
            }`}
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-400">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <Input
        label="Name"
        placeholder="Dell XPS 15"
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        label="Description"
        placeholder="High-end laptop"
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Unit Price ($)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("unitPrice")}
          error={errors.unitPrice?.message}
        />
        <Input
          label="Units in Stock"
          type="number"
          placeholder="0"
          {...register("unitsInStock")}
          error={errors.unitsInStock?.message}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}