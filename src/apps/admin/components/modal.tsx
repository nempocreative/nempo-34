import { X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg";
}

export function Modal({ title, open, onClose, children, size = "lg" }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxW} max-h-[92vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-gray-900 text-base">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}
export function Field({ label, children, required }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white";
export const textareaCls = `${inputCls} resize-none leading-relaxed`;

interface FormActionsProps {
  onCancel: () => void;
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: string;
}
export function FormActions({ onCancel, loading, disabled, submitLabel = "Simpan" }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={loading || disabled}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
      >
        {loading ? "Menyimpan..." : submitLabel}
      </button>
    </div>
  );
}
