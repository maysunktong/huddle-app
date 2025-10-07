"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { SignUp } from "../../../actions/sign-up";
import { signUpSchema } from "../../../schemas/zod.schemas";
import ErrorMessage from "../../../components/Form/ErrorMessage";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const SignUpForm = ({ className }: { className?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: SignUp,
  });

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col gap-6", className)}>
        <Card className="p-6 rounded">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create your account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit((values) => mutate(values))}>
              <FieldGroup>
                {/* Username */}
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Tooltip open={!!errors.username}>
                    <TooltipTrigger asChild>
                      <Input
                        id="username"
                        type="text"
                        placeholder="John Doe"
                        {...register("username")}
                      />
                    </TooltipTrigger>
                    {errors.username?.message && (
                      <TooltipContent>
                        <p>{errors.username.message}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </Field>

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
                <Field className="pt-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Signing up..." : "Create Account"}
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
                {/* General server error */}
                {error && error.message !== "NEXT_REDIRECT" && (
                  <div className="mt-2">
                    <ErrorMessage message={error.message} />
                  </div>
                )}
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Policy */}
        <p className="px-6 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </TooltipProvider>
  );
};

export default SignUpForm;
