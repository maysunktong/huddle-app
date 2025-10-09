import { v4 as uuid } from 'uuid';
import { createServerClient } from './server';

export const uploadImage = async (image: File) => {
  const supabase = await createServerClient();
  const BUCKET_NAME = 'images';

  const imageName: string[] = image.name.split(".");
  const path: string = `${imageName[0]}-${uuid()}.${imageName[1]}`;

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, image);

  if (error) throw error;

  const { data: { publicUrl } } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
  return publicUrl;
}
