import { v4 as uuid } from 'uuid';
import { createServerClient } from './server';

export const uploadImages = async (images: File[]): Promise<string[]> => {
  const supabase = await createServerClient();
  const BUCKET_NAME = "images";

  if (!images || images.length === 0) return [];

  const urls = await Promise.all(
    images.map(async (image): Promise<string> => {
      const [name, ext] = image.name.split(".");
      const path = `${name}-${uuid()}.${ext}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, image, { contentType: image.type });
      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
      return publicUrl;
    })
  );

  return urls;
};
