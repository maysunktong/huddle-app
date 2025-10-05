"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../../components/Form/ErrorMessage";
import { logInSchema } from "../../schemas/zod.schemas";
import { LogIn } from "../../actions/log-in";

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
  });

  /* Mutation helps with try catch error */
  const { mutate, isPending, error } = useMutation({
    mutationFn: LogIn,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="flex flex-col"
      >
        <fieldset>
          {/* Email */}
          <label htmlFor="email">Enter your email</label>
          <input
            id="main"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email?.message && (
            <ErrorMessage message={errors.email.message} />
          )}
        </fieldset>
        <fieldset>
          {/* Password */}
          <label htmlFor="password">Enter your password</label>
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
        <button type="submit">{isPending ? "Logging in..." : "log in"}</button>
      </form>
      {error && error.message !== "NEXT_REDIRECT" && (
        <ErrorMessage message={error.message} />
      )}
    </>
  );
};
export default LogInForm;
