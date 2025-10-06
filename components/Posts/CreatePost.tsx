"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import ErrorMessage from "../Form/ErrorMessage";
import { addPostSchema } from "../../schemas/zod.schemas";
import AddPost from "../../actions/add-post";

const CreatePostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof addPostSchema>>({
    resolver: zodResolver(addPostSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AddPost,
    onSuccess: () => {
      toast.success("Post added successfully!");
      reset();
    },
    onError: (err) => {
      if (
        err.message ===
        'duplicate key value violates unique constraint "posts_slug_key"'
      ) {
        return toast.error("Title is duplicated!");
      }
      toast.error(err.message || "Failed to add post");
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="p-4 flex flex-col w-[700px] mx-auto"
      >
        <fieldset>
          <label htmlFor="title">Post Title</label>
          <input
            id="title"
            placeholder="Enter your title"
            {...register("title")}
          />
          {errors.title?.message && (
            <ErrorMessage message={errors.title.message} />
          )}
        </fieldset>

        <fieldset>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            placeholder="Write your post..."
            {...register("body")}
          />
          {errors.body?.message && (
            <ErrorMessage message={errors.body.message} />
          )}
        </fieldset>

        <button type="submit">{isPending ? "Posting..." : "Add Post"}</button>
      </form>
    </>
  );
};

export default CreatePostForm;
