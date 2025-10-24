"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import ErrorMessage from "./ErrorMessage";
import { addPostSchema } from "../schemas/zod.schemas";

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
import { CirclePlusIcon, X } from "lucide-react";
import { toast } from "sonner";
import { CreatePost } from "../actions/create-post";

const CreatePostDialog = ({ text = "Create Post" }: { text?: string }) => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const schemaWithImage = addPostSchema.omit({ images: true }).extend({
    images: z
      .unknown()
      .transform((value) => value as FileList)
      .optional(),
  });

  const MAX_IMAGES_AMOUNT = 3;
  const MAX_FILE_SIZE_MB = 2;

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
      setSelectedFiles([]);
      setOpen(false);
      setTimeout(() => {
        toast.success("Post added successfully!");
      }, 1000);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add post");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > MAX_IMAGES_AMOUNT) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES_AMOUNT} images.`);
      e.target.value = "";
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleImageDelete = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = handleSubmit((values) => {
    const files = selectedFiles;

    if (files.length > MAX_IMAGES_AMOUNT) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES_AMOUNT} images.`);
      return;
    }

    const fileSizeLimit = files.find(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );
    if (fileSizeLimit) {
      toast.error(`Each image must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    const imageForm = new FormData();
    files.forEach((file) => imageForm.append("images", file));

    mutate({
      title: values.title,
      content: values.content,
      images: imageForm,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlusIcon />
          {text}
        </Button>
      </DialogTrigger>
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
            {/* Image File Input */}
            <div className="grid gap-2">
              <Label htmlFor="image">Upload image</Label>
              <Input
                type="file"
                multiple
                id="image"
                accept="image/*"
                className="cursor-pointer"
                {...register("images")}
                onChange={(e) => {
                  handleFileChange(e);
                  register("images").onChange(e);
                }}
              />
              {errors.images && (
                <ErrorMessage message={errors.images.message!} />
              )}
              {/* File List Preview */}
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md bg-muted/30"
                  >
                    <div className="text-sm">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <X
                      onClick={() => handleImageDelete(index)}
                      className="cursor-pointer"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
