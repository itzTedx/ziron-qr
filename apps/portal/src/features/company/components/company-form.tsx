"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBuilding,
  IconEdit,
  IconLoader,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ziron/ui/components/alert-dialog";
import { Button, buttonVariants } from "@ziron/ui/components/button";
import { DialogFooter } from "@ziron/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { Textarea } from "@ziron/ui/components/textarea";
import { companySchema, CompanyType } from "@ziron/validators";

import { upsertCompany } from "../actions/mutations";

interface CompanyFormProps {
  initialData: CompanyType;
  isEditMode: boolean;
}

export default function CompanyForm({
  initialData,
  isEditMode,
}: CompanyFormProps) {
  const [isPending, startTransition] = useTransition();
  //   const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const [modal, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });

  const defaultValues = initialData ? { ...initialData } : {};

  const form = useForm<CompanyType>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  //     onError: (error) => {
  //       console.log(error);
  //       toast.error("Something went wrong.");
  //       setLoading(false);
  //     },
  //   });

  //   const { execute: deleteAction } = useAction(deleteCompany, {
  //     onSuccess: ({ data }) => {
  //       if (data?.success) {
  //         router.push("/");
  //         toast.success(data.success);
  //         closeModal();
  //       }
  //       if (data?.error) toast.error(data.error);
  //     },
  //   });

  function onSubmit(values: CompanyType) {
    startTransition(async () => {
      const result = await upsertCompany(values);

      if (result.success) {
        toast.success(
          `Company: ${result.data?.name} has been ${isEditMode ? "Edited" : "Created"}`,
        );
        setCompanyModal({ modal: null });
      }
    });
  }

  const logo = form.getValues("logo");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 pt-3">
        <div className="flex flex-col gap-6 pb-6 md:flex-row">
          <FormField
            control={form.control}
            name="logo"
            render={({}) => (
              <FormItem>
                <FormControl>
                  <div className="mt-2 flex flex-col items-center gap-2">
                    <div className="grid size-28 place-items-center rounded-md border bg-gray-50">
                      {uploading && (
                        <IconLoader className="text-muted-foreground/50 absolute animate-spin" />
                      )}
                      {!uploading && logo ? (
                        <Image
                          src={logo}
                          height={70}
                          width={70}
                          alt="Company Logo"
                        />
                      ) : (
                        <IconBuilding className="text-muted size-20" />
                      )}
                    </div>
                    {/* <UploadButton
                      endpoint="logoUploader"
                      className="hover:bg-primary/5 ut-button:h-9 ut-button:w-fit ut-button:bg-primary ut-button:px-4 ut-allowed-content:text-xs ut-allowed-content:text-secondary-foreground/70 ut-label:text-primary ut-button:ut-uploading:after:bg-secondary cursor-pointer transition-all duration-500 ease-in-out"
                      onUploadBegin={() => {
                        setLoading(true);
                        setUploading(true);
                        toast.loading("Uploading Image");
                      }}
                      onClientUploadComplete={(res) => {
                        setLoading(false);
                        setUploading(false);
                        form.setValue("logo", res[0].url);
                        toast.dismiss();
                        toast.success("Logo Uploaded");
                      }}
                      content={{
                        button({ ready, isUploading }) {
                          if (ready)
                            if (isUploading)
                              return (
                                <div className="text-sm">Uploading...</div>
                              );

                          return (
                            <div className="text-sm text-nowrap">
                              {form.getValues("logo")
                                ? "Change Logo"
                                : "Upload Logo"}
                            </div>
                          );
                        },
                        allowedContent({ ready, isUploading }) {
                          if (!ready) return "";
                          if (isUploading) return "";
                          return `Formats: png, svg`;
                        },
                      }}
                    /> */}
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      autoFocus
                      {...field}
                      className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+971 98 765 4321" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="www.website.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter full address"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter className="gap-3">
          {isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-1.5 font-medium hover:bg-red-500 hover:text-red-100"
                >
                  <IconTrash className="size-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the company and all the cards related to it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    // onClick={() => deleteAction({ id: initialData.id! })}
                  >
                    Yes, I&apos;m sure
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="submit" disabled={isPending}>
            <LoadingSwap
              isLoading={isPending}
              className="flex items-center justify-center gap-1.5 font-medium"
            >
              {isEditMode ? (
                <IconEdit className="size-4" />
              ) : (
                <IconPlus className="size-4" />
              )}
              {isEditMode ? "Save Changes" : "Add Company"}
            </LoadingSwap>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
