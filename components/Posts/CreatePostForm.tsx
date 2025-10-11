"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorMessage from "../Form/ErrorMessage";
import { addPostSchema } from "../../schemas/zod.schemas";
import CreatePost from "../../actions/create-post";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlusIcon } from "lucide-react";

const CreatePostDialog = () => {
  const [open, setOpen] = useState(false);

  const schemaWithImage = addPostSchema.omit({ image: true }).extend({
    image: z
      .unknown()
      .transform((value) => value as FileList)
      .optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaWithImage),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: CreatePost,
    onSuccess: () => {
      toast.success("Post added successfully!");
      reset();
      setOpen(false); // 👈 Close modal after success
    },
    onError: (err: any) => {
      if (
        err.message ===
        'duplicate key value violates unique constraint "posts_slug_key"'
      ) {
        return toast.error("Title is duplicated!");
      }
      toast.error(err.message || "Failed to add post");
    },
  });

  const onSubmit = handleSubmit((values) => {
    const imageForm = new FormData();
    if (values.image) imageForm.append("image", values.image[0]);
    mutate({
      title: values.title,
      content: values.content,
      image: imageForm,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <CirclePlusIcon />
          Post
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new post</DialogTitle>
            <DialogDescription>
              Fill out the details below to publish your post.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                placeholder="Enter your title"
                {...register("title")}
              />
              {errors.title && <ErrorMessage message={errors.title.message!} />}
            </div>

            {/* Content */}
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post..."
                {...register("content")}
              />
              {errors.content && (
                <ErrorMessage message={errors.content.message!} />
              )}
            </div>

            {/* Image */}
            <div className="grid gap-2">
              <Label htmlFor="image">Upload image</Label>
              <Input type="file" id="image" {...register("image")} />
              {errors.image && <ErrorMessage message={errors.image.message!} />}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Posting..." : "Add Post"}
            </Button>
          </DialogFooter>

          {error && <ErrorMessage message={error.message} />}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
