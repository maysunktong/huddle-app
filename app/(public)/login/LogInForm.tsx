"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { LogIn } from "../../../actions/log-in";
import { logInSchema } from "../../../schemas/zod.schemas";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ErrorMessage from "../../../components/ErrorMessage";

const LogInForm = ({ className }: { className?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: LogIn,
  });

  return (
    <TooltipProvider>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className={cn("flex flex-col gap-6", className)}
      >
        <FieldGroup>
          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold text-white md:text-foreground">
              Login to your account
            </h1>
          </div>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Tooltip open={!!errors.email}>
              <TooltipTrigger asChild>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
              </TooltipTrigger>
              {errors.email?.message && (
                <TooltipContent>
                  <p>{errors.email.message}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Tooltip open={!!errors.password}>
              <TooltipTrigger asChild>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
              </TooltipTrigger>
              {errors.password?.message && (
                <TooltipContent>
                  <p>{errors.password.message}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </Field>

          {/* Submit Button */}
          <Field className="pt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="/signup">Sign up</a>
          </FieldDescription>
          {/* General server error */}
          {error && error.message !== "NEXT_REDIRECT" && (
            <ErrorMessage message={error.message} />
          )}
        </FieldGroup>
      </form>
    </TooltipProvider>
  );
};

export default LogInForm;
