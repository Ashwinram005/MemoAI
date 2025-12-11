import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, File, X, FileText, Image, FileType, CheckCircle } from 'lucide-react';
import { cn } from '../../utils';

export default function Upload({ onUpload, isUploading }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            onUpload(acceptedFiles);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, fileRejections } = useDropzone({
        onDrop,
        maxSize: 10 * 1024 * 1024, // 10MB
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        disabled: isUploading
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "relative border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-out group overflow-hidden",
                    isDragActive
                        ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 scale-[1.01]"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md",
                    isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
            >
                <input {...getInputProps()} />

                {/* Subtle Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex flex-col items-center justify-center z-10">
                    <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 border",
                        isDragActive
                            ? "bg-primary-100 dark:bg-primary-900/40 text-primary-600 border-primary-200 dark:border-primary-700"
                            : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700 shadow-sm group-hover:text-primary-500 group-hover:border-primary-100 dark:group-hover:border-primary-800"
                    )}>
                        <UploadIcon size={24} className={cn("transition-transform", isDragActive && "scale-110")} />
                    </div>

                    <h3 className={cn(
                        "text-base font-semibold mb-1 transition-colors",
                        isDragActive ? "text-primary-700 dark:text-primary-400" : "text-gray-900 dark:text-gray-100"
                    )}>
                        {isDragActive ? 'Drop to upload' : 'Click or drop files'}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 max-w-[200px] leading-relaxed">
                        Support for PDF, DOCX, TXT, and Images (max 10MB)
                    </p>

                    {isUploading ? (
                        <div className="flex items-center text-xs text-primary-600 font-medium">
                            <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse mr-2"></div>
                            Uploading...
                        </div>
                    ) : (
                        <div className="flex gap-2 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                            <FileText size={14} className="text-gray-400" />
                            <Image size={14} className="text-gray-400" />
                            <FileType size={14} className="text-gray-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Error messages for rejected files */}
            {fileRejections.length > 0 && (
                <div className="mt-4 space-y-2 animate-slide-up">
                    {fileRejections.map(({ file, errors }) => (
                        <div key={file.name} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-xs border border-red-100 dark:border-red-800/50">
                            <X size={14} className="mr-2 flex-shrink-0" />
                            <span>
                                <span className="font-medium">{file.name}</span>: {errors[0].message}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
