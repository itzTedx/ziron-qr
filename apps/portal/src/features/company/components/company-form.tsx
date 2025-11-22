"use client";

import { useState, useTransition } from "react";

import Image from "next/image";

import { isDefinedError } from "@orpc/client";
import { IconBuilding, IconEdit, IconLoader, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ziron/ui/components/alert-dialog";
import { Button } from "@ziron/ui/components/button";
import { DialogFooter } from "@ziron/ui/components/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, zodResolver } from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { Textarea } from "@ziron/ui/components/textarea";
import { CompanyType, companySchema } from "@ziron/validators";

import { orpc } from "@/lib/orpc/client";

import { deleteCompany } from "../actions/mutations";

interface CompanyFormProps {
  initialData: CompanyType;
  isEditMode: boolean;
}

export default function CompanyForm({ initialData, isEditMode }: CompanyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const queryClient = useQueryClient();

  const [, setCompanyModal] = useQueryStates({
    modal: parseAsString,
  });
  const [_, setFields] = useQueryStates({
    id: parseAsString,
    name: parseAsString,
    logo: parseAsString,
    address: parseAsString,
    phone: parseAsString,
    website: parseAsString,
  });

  const defaultValues = initialData ? { ...initialData } : {};

  const form = useForm<CompanyType>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  const createCompany = useMutation(
    orpc.company.create.mutationOptions({
      onSuccess: (newCompany) => {
        toast.success(`Company: ${newCompany.companyName} created successfully`);

        queryClient.invalidateQueries({
          queryKey: orpc.company.list.queryKey(),
        });

        setCompanyModal({ modal: null });
        setFields({
          id: null,
          name: null,
          logo: null,
          address: null,
          phone: null,
          website: null,
        });
        form.reset(); // This will reset the form fields to their default values
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === "NOT_FOUND") {
            toast.error("Company not found", { description: error.message });
            return;
          }
          toast.error("Failed to create company, try again later!", { description: error.message });
          return;
        }
        toast.error(error.message);
      },
    })
  );

  function onSubmit(values: CompanyType) {
    createCompany.mutate(values);
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCompany(id);

      if (result.success) {
        toast.success(`Company: ${result.data?.name} has been ${isEditMode ? "Edited" : "Created"}`);
        setCompanyModal({ modal: null });
        setFields({
          id: null,
          name: null,
          logo: null,
          address: null,
          phone: null,
          website: null,
        });
        form.reset(); // This will reset the form fields to their default values
      }

      if (result.error) {
        toast.error(result.error);
        console.error(result.details);
      }
      setIsDeleteLoading(false);
    });
  }

  const logo = form.getValues("logo");

  return (
    <Form {...form}>
      <form className="p-6 pt-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 pb-6 md:flex-row">
          <FormField
            control={form.control}
            name="logo"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="mt-2 flex flex-col items-center gap-2">
                    <div className="grid size-28 place-items-center rounded-md border bg-gray-50">
                      {uploading && <IconLoader className="absolute animate-spin text-muted-foreground/50" />}
                      {!uploading && logo ? (
                        <Image alt="Company Logo" height={70} src={logo} width={70} />
                      ) : (
                        <IconBuilding className="size-20 text-muted" />
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
                    <Input autoFocus placeholder="Name" {...field} className="w-full" />
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
                    <Textarea placeholder="Enter full address" {...field} className="w-full" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter className="gap-3 sm:justify-start">
          {isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild onClick={() => setIsDeleteLoading(true)}>
                <Button variant="destructive">
                  <LoadingSwap isLoading={isDeleteLoading}>
                    <IconTrash className="size-4" />
                    Delete
                  </LoadingSwap>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the company and all the cards related to
                    it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDeleteLoading(false)}>Cancel</AlertDialogCancel>

                  <Button onClick={() => handleDelete(initialData.id ?? "")} type="button" variant={"destructive"}>
                    <LoadingSwap isLoading={isDeletePending}>Yes, I&apos;m sure</LoadingSwap>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button className="w-full shrink" disabled={createCompany.isPending} type="submit">
            <LoadingSwap
              className="flex items-center justify-center gap-1.5 font-medium"
              isLoading={createCompany.isPending}
            >
              {isEditMode ? <IconEdit className="size-4" /> : <IconPlus className="size-4" />}
              {isEditMode ? "Save Changes" : "Add Company"}
            </LoadingSwap>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
