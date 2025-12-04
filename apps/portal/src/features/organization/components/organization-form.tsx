"use client";

import { useRef } from "react";

import Image from "next/image";

import { useUploadFile } from "@better-upload/client";
import { formatBytes } from "@better-upload/client/helpers";
import { isDefinedError } from "@orpc/client";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";
import { Controller, useForm } from "react-hook-form";
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ziron/ui/components/field";
import { zodResolver } from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { Textarea } from "@ziron/ui/components/textarea";

import { cn } from "@ziron/utils";
import { OrganizationType, organizationSchema } from "@ziron/validators";

import { UploadButton } from "@/components/ui/upload-button";

import { UPLOAD_ROUTES } from "@/lib/constants/upload";
import { orpc } from "@/lib/orpc/client";

interface OrganizationFormProps {
  initialData: OrganizationType;
  isEditMode: boolean;
}

export default function OrganizationForm({ initialData, isEditMode }: OrganizationFormProps) {
  const uploadButtonRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [, setOrganizationModal] = useQueryStates({
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

  const form = useForm<OrganizationType>({
    resolver: zodResolver(organizationSchema),
    defaultValues,
  });

  const handleCancel = () => {
    setOrganizationModal({ modal: null });
    setFields({
      id: null,
      name: null,
      logo: null,
      address: null,
    });
  };

  const { control, upload } = useUploadFile({
    route: UPLOAD_ROUTES.logo,
    onError: (error) => {
      toast.error("Upload Error", { description: error.message });
    },
    onUploadComplete: ({ file, metadata }) => {
      form.setValue("logo", (metadata?.url as string) ?? null);
      toast.success("Upload Successful", {
        description: `File: ${file.raw.name ?? null}, Size: ${formatBytes(file.raw.size ?? 0)}`,
      });
    },
  });

  const createOrganization = useMutation(
    orpc.organization.create.mutationOptions({
      onSuccess: (newOrganization) => {
        toast.success(`Organization: ${newOrganization.organizationName} created successfully`);

        queryClient.invalidateQueries({
          queryKey: orpc.organization.list.queryKey(),
        });

        handleCancel();
        form.reset(); // This will reset the form fields to their default values
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === "NOT_FOUND") {
            toast.error("Organization not found", { description: error.message });
            return;
          }
          toast.error("Failed to create organization, try again later!", { description: error.message });
          return;
        }
        toast.error(error.message);
      },
    })
  );

  const deleteOrganization = useMutation(
    orpc.organization.delete.mutationOptions({
      onSuccess: (result) => {
        toast.success(`Organization: ${result.organizationName} has been deleted`);
        queryClient.invalidateQueries({
          queryKey: orpc.organization.list.queryKey(),
        });
        setOrganizationModal({ modal: null });
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
          toast.error("Failed to delete organization, try again later!", { description: error.message });
          return;
        }
        toast.error(error.message);
      },
    })
  );

  function onSubmit(values: OrganizationType) {
    createOrganization.mutate(values);
  }

  function handleDeleteOrganization(id: string) {
    deleteOrganization.mutate({ id });
  }

  const logo = form.watch("logo");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-6">
        <Controller
          control={form.control}
          name="logo"
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend variant="label">Organization Logo</FieldLegend>
              <Field data-invalid={fieldState.invalid} orientation="responsive">
                <FieldContent className="flex-row items-center gap-3">
                  <div
                    className={cn(
                      "group flex size-20 items-center justify-center rounded-full border bg-card",
                      fieldState.invalid && "border-destructive"
                    )}
                  >
                    {logo && (
                      <div className="relative size-12 group-hover:hidden">
                        <Image alt="Organization Logo" className="object-contain" fill src={logo ?? ""} />
                      </div>
                    )}
                    <div
                      className={cn(
                        "relative size-12 cursor-pointer items-center justify-center",
                        logo ? "hidden group-hover:flex" : "flex"
                      )}
                      onClick={() => uploadButtonRef.current?.click()}
                    >
                      <IconCloudUpload className="size-6 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <UploadButton
                        buttonProps={{ variant: "outline", size: "sm" }}
                        control={control}
                        inputRef={uploadButtonRef}
                      />
                      {logo && (
                        <Button
                          className="hover:bg-destructive-foreground hover:text-destructive"
                          onClick={() => form.setValue("logo", undefined)}
                          size="sm"
                          variant="ghost"
                        >
                          <IconTrash className="size-4" /> Remove
                        </Button>
                      )}
                    </div>
                    <FieldDescription className="text-xs">Recommended size: 160x160px</FieldDescription>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            </FieldSet>
          )}
        />
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Organization Name</FieldLabel>
                <Input autoFocus placeholder="Acme, Inc." {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
        <FieldGroup className="flex-row">
          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <Input placeholder="+971 98 765 4321" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="website"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Website URL</FieldLabel>
                  <Input placeholder="www.website.com" {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>
        <Controller
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Textarea placeholder="Enter full address" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
        <div className="flex items-center justify-between gap-2">
          {isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <LoadingSwap isLoading={deleteOrganization.isPending}>
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
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <Button
                    onClick={() => handleDeleteOrganization(initialData.id ?? "")}
                    type="button"
                    variant={"destructive"}
                  >
                    <LoadingSwap isLoading={deleteOrganization.isPending}>Yes, I&apos;m sure</LoadingSwap>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button className="w-full" disabled={createOrganization.isPending} size="lg" type="submit">
            <LoadingSwap
              className="flex items-center justify-center gap-1.5 font-medium"
              isLoading={createOrganization.isPending}
            >
              {isEditMode ? "Save Changes" : "Create Organization"}
            </LoadingSwap>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
