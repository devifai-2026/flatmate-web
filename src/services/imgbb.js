const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error('Image upload failed');
  return data.data.display_url;
}
