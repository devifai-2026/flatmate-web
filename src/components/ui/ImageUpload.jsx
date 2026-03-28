import { useRef, useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../services/imgbb';

export default function ImageUpload({ value, onChange, multiple = false, max = 8, className = '' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const images = multiple ? (value || []) : (value ? [value] : []);
  const canAdd = !multiple || images.length < max;

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (multiple && images.length + files.length > max) {
      toast.error(`Maximum ${max} images allowed`);
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f)));
      if (multiple) {
        onChange([...images, ...urls]);
      } else {
        onChange(urls[0]);
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const remove = (idx) => {
    if (multiple) {
      onChange(images.filter((_, i) => i !== idx));
    } else {
      onChange('');
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {canAdd && <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-dark/15 hover:border-primary/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-primary/5 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={20} className="text-primary animate-spin" />
          ) : (
            <>
              <Camera size={18} className="text-muted" />
              <span className="text-[10px] text-muted">Upload</span>
            </>
          )}
        </button>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
