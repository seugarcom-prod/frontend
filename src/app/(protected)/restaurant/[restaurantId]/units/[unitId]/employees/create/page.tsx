'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import EmployeeForm from '@/components/employee/EmployeeForm';

const CreateEmployeePage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const unitId = params.unitId as string;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    const isAuthorized = session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER';

    if (!isAuthorized) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-6 text-center">
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Acesso Negado</h2>
                        <p>Você não tem permissão para acessar esta página.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <EmployeeForm unitId={unitId} isEditMode={false} />
        </div>
    );
};

export default CreateEmployeePage; 