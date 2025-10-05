"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../../components/Form/ErrorMessage";
import { signUpSchema } from "../../schemas/zod.schemas";
import { SignUp } from "../../actions/sign-up";

const SignUpForm = () => {
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
    <>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="p-4 flex flex-col w-[700px] mx-auto"
      >
        <fieldset>
          <label htmlFor="email">Enter your email</label>
          <input
            id="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email?.message && (
            <ErrorMessage message={errors.email.message} />
          )}
        </fieldset>
        <fieldset>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            placeholder="Enter your username"
            {...register("username")}
          />
          {errors.username?.message && (
            <ErrorMessage message={errors.username.message} />
          )}
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password?.message && (
            <ErrorMessage message={errors.password.message} />
          )}
        </fieldset>
        <button type="submit">{isPending ? "Signing up..." : "Sign up"}</button>
      </form>
      {error && error.message !== "NEXT_REDIRECT" && (
        <ErrorMessage message={error.message} />
      )}
    </>
  );
};

export default SignUpForm;
