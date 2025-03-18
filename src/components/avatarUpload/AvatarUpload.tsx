"use client";

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
    size?: 'sm' | 'md' | 'lg';
    onImageChange: (file: File) => void;
    isLoading?: boolean;
}

const sizeMap = {
    sm: {
        container: 'w-20 h-20',
        icon: 'w-4 h-4',
    },
    md: {
        container: 'w-24 h-24',
        icon: 'w-5 h-5',
    },
    lg: {
        container: 'w-28 h-28',
        icon: 'w-6 h-6',
    },
};

export default function AvatarUpload({
    size = 'md',
    onImageChange,
    isLoading = false
}: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const containerSize = sizeMap[size].container;
    const iconSize = sizeMap[size].icon;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Criar preview da imagem
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Chamar o callback com o arquivo selecionado
        onImageChange(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${containerSize} cursor-pointer group`} onClick={triggerFileInput}>
                <Avatar className={`${containerSize} border-2 border-border`}>
                    {preview ? (
                        <AvatarImage src={preview} alt="Avatar preview" />
                    ) : (
                        <AvatarFallback className="bg-gray-100 text-gray-400">
                            {isLoading ? (
                                <Loader2 className={`${iconSize} animate-spin text-gray-500`} />
                            ) : (
                                <span className="text-2xl">U</span>
                            )}
                        </AvatarFallback>
                    )}
                </Avatar>

                {!isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="text-white" />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={isLoading}
            />

            <span className="text-sm text-gray-500 mt-2">
                {isLoading ? 'Fazendo upload...' : 'Clique para adicionar'}
            </span>
        </div>
    );
}