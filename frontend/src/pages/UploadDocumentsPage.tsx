import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const supportedFormats = [
  { ext: 'PDF', color: 'bg-rose-500 text-white', icon: '📄' },
  { ext: 'DOCX', color: 'bg-blue-500 text-white', icon: '📝' },
  { ext: 'PPTX', color: 'bg-amber-500 text-white', icon: '📊' },
  { ext: 'TXT', color: 'bg-slate-500 text-white', icon: '📃' },
  { ext: 'MD', color: 'bg-teal-600 text-white', icon: '📑' },
  { ext: 'JPG', color: 'bg-pink-500 text-white', icon: '🖼️' },
  { ext: 'PNG', color: 'bg-teal-500 text-white', icon: '🌄' },
  { ext: 'MP3', color: 'bg-emerald-500 text-white', icon: '🎵' },
  { ext: 'MP4', color: 'bg-violet-600 text-white', icon: '🎬' },
];

interface UploadItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'completed' | 'indexing';
}

const UploadDocumentsPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Please login first to upload documents.");
      return;
    }
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    Array.from(files).forEach(async (file) => {
      const uploadId = Math.random().toString();
      
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} is larger than 50MB limit.`);
        return;
      }

      setUploads((prev) => [
        {
          id: uploadId,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          progress: 30, // Indicate it's uploading
          status: 'uploading',
        },
        ...prev
      ]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/api/v1/documents/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Do NOT set Content-Type for FormData
          },
          body: formData,
        });

        if (!response.ok) {
           throw new Error("Upload failed");
        }
        
        await response.json();

        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, progress: 100, status: 'completed' } : u,
          ),
        );
      } catch (err) {
        alert(`Failed to upload ${file.name}. Ensure backend is running.`);
        setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Upload Documents
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload files from multiple sources and let AI handle the rest.
        </p>
      </div>

      {/* Main Upload Drop Area Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-14 px-6 text-center transition-all ${
            dragActive
              ? 'border-[#000000] bg-teal-50/50'
              : 'border-slate-300 bg-slate-50/40 hover:border-[#000000]/60 hover:bg-slate-50/80'
          }`}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Cloud Upload Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-[#000000] shadow-sm mb-4">
            <svg
              className="h-9 w-9 stroke-[#000000]"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m16 16-4-4-4 4" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-slate-800">Drag & drop files here</h3>
          <p className="my-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            or
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-[#000000] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition duration-200 hover:bg-[#000000] active:scale-[0.98]"
          >
            Browse Files
          </button>
        </div>

        {/* Supported Formats Bar */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left">
            Supported Formats:
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
            {supportedFormats.map((format) => (
              <div
                key={format.ext}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition hover:border-[#000000]/40"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${format.color}`}
                >
                  {format.ext.slice(0, 3)}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {format.ext}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Uploads Queue (if any) */}
      {uploads.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Uploaded Queue ({uploads.length})
            </h3>
            <Link
              to="/documents"
              className="text-xs font-semibold text-[#000000] hover:underline"
            >
              Go to My Documents →
            </Link>
          </div>

          <div className="space-y-3">
            {uploads.map((file) => (
              <div
                key={file.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span className="font-semibold text-slate-800">{file.name}</span>
                    <span className="text-slate-400">({file.size})</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      file.status === 'completed'
                        ? 'text-emerald-600'
                        : 'text-[#000000]'
                    }`}
                  >
                    {file.status === 'completed'
                      ? '✓ Ready for AI'
                      : `${file.progress}%`}
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    style={{ width: `${file.progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[#000000] to-[#666666] transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocumentsPage;
