"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import ErrorMessage from "../Form/ErrorMessage";
import { addPostSchema } from "../../schemas/zod.schemas";
import CreatePost from "../../actions/create-post";

const CreatePostForm = () => {
  const schemaWithImage = addPostSchema.omit({ image: true }).extend({
    image: z
      .unknown()
      .transform((value) => {
        return value as FileList;
      })
      .optional(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof addPostSchema>>({
    resolver: zodResolver(schemaWithImage),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: CreatePost,
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
        onSubmit={handleSubmit((values) => {
          const imageForm = new FormData();
          if (values.image) imageForm.append("image", values.image[0]);
          mutate({title: values.title, content: values.content, image:imageForm});
        })}
        className="p-4 flex flex-col w-[700px] mx-auto"
      >
        <fieldset>
          <label htmlFor="title">Post Title</label>
          <input
            id="title"
            placeholder="Enter your title"
            {...register("title")}
          />
          {errors.title && <ErrorMessage message={errors.title.message!} />}
        </fieldset>

        <fieldset>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            placeholder="Write your post..."
            {...register("content")}
          />
          {errors.content && <ErrorMessage message={errors.content.message!} />}
        </fieldset>
        <fieldset>
          <label htmlFor="image">Upload image</label>
          <input type="file" {...register("image")} id="image" />
          {errors.image && <ErrorMessage message={errors.image.message!} />}
        </fieldset>
        <button type="submit">{isPending ? "Posting..." : "Add Post"}</button>
        {error && <ErrorMessage message={error.message} />}
      </form>
    </>
  );
};

export default CreatePostForm;
