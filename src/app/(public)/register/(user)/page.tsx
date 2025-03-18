"use client"

import ClientInfoForm from '@/components/users/client/ClientInfoForm';

export default function RegisterClientPage() {
    return (
        <div className="flex min-h-screen w-full">
            <div className="w-full">
                <ClientInfoForm />
            </div>
        </div>
    );
}