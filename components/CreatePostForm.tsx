"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import ErrorMessage from "./ErrorMessage";
import { addPostSchema } from "../schemas/zod.schemas";
import CreatePost from "../actions/create-post";

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
import { toast } from "sonner";

const CreatePostDialog = ({ text = "Create Post" }: { text?: string }) => {
  const [open, setOpen] = useState(false);

  const schemaWithImage = addPostSchema.omit({ images: true }).extend({
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
      reset();
      setOpen(false);
      setTimeout(() => {
        toast.success("Post added successfully!");
      }, 1000);
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
    const files = Array.from(values.image || []);

    const MAX_IMAGES_AMOUNT = 3;
    if (files.length > MAX_IMAGES_AMOUNT) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES_AMOUNT} images.`);
      return;
    }

    const MAX_FILE_SIZE_MB = 1;
    const tooLarge = files.find(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );
    if (tooLarge) {
      toast.error(`Each image must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    const imageForm = new FormData();
    if (values.image && values.image.length > 0) {
      Array.from(values.image)
        .filter((file) => file.type.startsWith("image/"))
        .forEach((file) => imageForm.append("images", file));
    }
    mutate({
      title: values.title,
      content: values.content,
      images: imageForm,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlusIcon />
          {text}
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
                rows={5}
              />
              {errors.content && (
                <ErrorMessage message={errors.content.message!} />
              )}
            </div>
            {/* Image */}
            <div className="grid gap-2">
              <Label htmlFor="image">Upload image</Label>
              <Input
                type="file"
                multiple
                id="image"
                accept="image/*"
                {...register("image")}
              />
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
