"use client";

import * as z from "zod";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/file-upload";
import { billboardFormSchema } from "@/schemas/billboard-schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Billboard } from "@/generated/prisma";
import {
  createBillboard,
  deleteBillboard,
  updateBillboard,
} from "@/actions/billboard.actions";

type BillboardFormValues = z.infer<typeof billboardFormSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillBoardForm: FC<BillboardFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(billboardFormSchema),
    defaultValues: initialData || {
      name: "",
      image: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const res = await updateBillboard({ id: initialData.id, ...values });
        if (!res.ok) throw new Error(res.error);
      } else {
        const res = await createBillboard(values);
        if (!res.ok) throw new Error(res.error);
      }
      toast.success("Success", {
        description: toastMessage,
        position: "top-right",
      });
      router.push("/admin/billboards");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!initialData) {
        return;
      }
      await deleteBillboard(initialData.id);
      toast.success("Success", {
        description: "Billboard deleted",
      });
      router.push("/admin/billboards");
    } catch {
      toast.error("Error", {
        description:
          "Make sure you removed all categories using this billboard first.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className={"flex items-center justify-between"}>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className={"h-4 w-4"} />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"space-y-8 w-full"}
        >
          <div className={"grid grid-cols-1 gap-8"}>
            <FormField
              control={form.control}
              name={"image"}
              render={({ field }) => (
                <FormItem className={"max-w-[300px]"}>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      endpoint={"imageUrl"}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={"Billboard Name"}
                      disabled={loading}
                      className={"max-w-[300px]"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"}
          >
            <FormField
              control={form.control}
              name={"isFeatured"}
              render={({ field }) => (
                <FormItem
                  className={
                    "flex items-start flex-row space-x-3 space-y-0 rounded-md border p-4"
                  }
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className={"space-y-1 leading-none"}>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      এই বিলবোর্ডটি হোম পেজে প্রদর্শিত হবে।
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"isArchived"}
              render={({ field }) => (
                <FormItem
                  className={
                    "flex items-start flex-row space-x-3 space-y-0 rounded-md border p-4"
                  }
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className={"space-y-1 leading-none"}>
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      এই বিলবোর্ডটি হোম পেজে প্রদর্শিত হবে না।
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading || !form.formState.isValid}
            className={"ml-auto"}
            type={"submit"}
          >
            {action}
          </Button>
        </form>
      </Form>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-medium mb-4">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
