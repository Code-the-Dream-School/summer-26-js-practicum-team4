import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

async function uploadPhoto(file, email) {
  const fileExt = file.name.split(".").pop().toLowerCase();
  const filePath = `${email}.${fileExt}`;

  const oldFiles = [
    `${email}.jpg`,
    `${email}.jpeg`,
    `${email}.png`,
    `${email}.webp`,
  ];

  const { error: deleteError } = await supabase.storage
    .from("profile_photo")
    .remove(oldFiles);

  if (deleteError) {
    throw new Error(deleteError.message || "Old profile photo deletion failed");
  }

  const { error: uploadError } = await supabase.storage
    .from("profile_photo")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Profile photo upload failed");
  }

  const { data } = supabase.storage
    .from("profile_photo")
    .getPublicUrl(filePath);

  return `${data.publicUrl}?t=${Date.now()}`;
}

async function deletePhoto(email) {
  const filePaths = [
    `${email}.jpg`,
    `${email}.jpeg`,
    `${email}.png`,
    `${email}.webp`,
  ];

  const { error } = await supabase.storage
    .from("profile_photo")
    .remove(filePaths);

  if (error) {
    throw new Error(error.message || "Profile photo deletion failed");
  }
}

export { uploadPhoto, deletePhoto };
