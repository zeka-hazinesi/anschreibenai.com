"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ProgressStepper from "@/components/progressStepper";
import { useRouter } from "@/i18n/navigation";
import Input from "@/components/ui/input";
import Image from "next/image";

export default function Address() {
  const t = useTranslations("address");
  const router = useRouter(); // Initialize router

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t("firstNameError"),
    }),
    surname: z.string().min(2, {
      message: t("lastNameError"),
    }),
    street: z.string().min(2, {
      message: t("streetError"),
    }),
    buildingNumber: z.string().min(1, {
      message: t("buildingNumberError"),
    }),
    zipCode: z.string().min(4, {
      message: t("postalCodeError"),
    }),
    city: z.string().min(2, {
      message: t("cityError"),
    }),
    phone: z.string().optional(),
    email: z.string().optional(),
  });

  // Initialize the useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      street: "",
      buildingNumber: "",
      zipCode: "",
      city: "",
      phone: "",
      email: "",
    },
  });

  const { watch, setValue } = form;

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        Object.keys(parsedAddress).forEach(key => {
          setValue(key as keyof z.infer<typeof formSchema>, parsedAddress[key]);
        });
      } catch (error) {
        console.error("Error parsing address from localStorage:", error);
      }
    }
  }, [setValue]);

  const allFields = watch();
  const allFieldsFilled = [
    allFields.name,
    allFields.surname,
    allFields.street,
    allFields.buildingNumber,
    allFields.zipCode,
    allFields.city,
  ].every(value => value.trim() !== "");

  const hasValues = Object.values(allFields).some(value => value.trim() !== "");

  const setAddressStorage = (values: z.infer<typeof formSchema>) => {
    localStorage.setItem("address", JSON.stringify(values));
  };

  const handleClearFields = () => {
    form.reset({
      name: "",
      surname: "",
      street: "",
      buildingNumber: "",
      zipCode: "",
      city: "",
      phone: "",
      email: "",
    });
    localStorage.removeItem("address");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAddressStorage(values);
    localStorage.setItem("skipAddress", "false");
    router.push("/personalization");
  }

  return (
    <div className="h-full w-full max-w-[210mm] p-4 sm:w-full sm:p-0">
      <ProgressStepper currentStep={2} />

      <div className="flex h-[20%] w-full flex-col items-center gap-4 px-0 pt-[4rem] sm:px-8 sm:pt-[6rem]">
        <h1 className="text-primary text-3xl font-bold lg:text-4xl xl:text-7xl">{t("title")}</h1>
        <p className="text-base leading-4.5 font-medium sm:text-lg">{t("description")}</p>
      </div>
      <div className="flex h-full min-h-[80%] w-full flex-col items-center justify-center self-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 p-0">
            <div className="flex w-full justify-end py-4">
              <button type="button" onClick={handleClearFields} className="flex h-6 w-6 cursor-pointer self-end">
                <Image
                  src={`/icons/${hasValues ? "trash-full" : "trash-empty"}.svg`}
                  alt="trash"
                  width={36}
                  height={36}
                  className="h-6 w-6"
                />
              </button>
            </div>
            <div className="flex h-auto w-full flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("firstName") + "*"}
                        value={field.value}
                        type="text"
                        autoComplete="given-name"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("lastName") + "*"}
                        value={field.value}
                        type="text"
                        autoComplete="family-name"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex h-auto w-full flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("street") + "*"}
                        value={field.value}
                        type="text"
                        autoComplete="address-line1"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buildingNumber"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("buildingNumber") + "*"}
                        value={field.value}
                        type="text"
                        autoComplete="address-line2"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex h-auto w-full flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("postalCode") + "*"}
                        value={field.value}
                        type="text"
                        autoComplete="postal-code"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("city") + "*"}
                        value={field.value}
                        type="text"
                        autoComplete="address-level2"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex h-auto w-full flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("phone")}
                        value={field.value || ""}
                        type="tel"
                        autoComplete="tel"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="h-auto w-full">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        label={t("email")}
                        type="email"
                        value={field.value || ""}
                        autoComplete="email"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex h-auto w-full flex-col-reverse gap-4 pt-4 lg:flex-row lg:justify-between lg:gap-8">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/")}
                  type="button"
                  className="text-primary h-[42px] w-full cursor-pointer bg-transparent px-8 text-lg shadow-none lg:w-auto"
                >
                  {t("back")}
                </Button>
              </div>
              <div className="flex h-auto w-auto flex-col-reverse gap-4 lg:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Set localStorage skip to true
                    localStorage.setItem("skipAddress", "true");
                    router.push("/personalization");
                  }}
                  className="text-primary h-[42px] w-full cursor-pointer px-8 text-lg shadow-none lg:w-auto"
                >
                  {t("skip")}
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  className={`h-[42px] w-full cursor-pointer px-8 text-lg lg:w-auto ${
                    allFieldsFilled ? "text-chart-1" : "bg-border opacity-50"
                  }`}
                  disabled={!allFieldsFilled}
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
