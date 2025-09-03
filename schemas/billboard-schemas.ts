import * as z from "zod";

export const billboardFormSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    image: z.string().min(1, "Please upload an image"),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
})