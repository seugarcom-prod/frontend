import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '../ui/card'
import { User2, Store, UserCog, UserCog2 } from 'lucide-react'

export function ActionCards() {
    const restaurantName = "lanchonete-do-bio";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gerenciar funcionários */}
            <Link href="/admin/funcionarios">
                <Card className="hover:shadow-md transition-shadow border border-border bg-transparent">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500">
                                <UserCog2 className="text-white justify-center h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-1 text-primary">Gerenciar funcionários</h3>
                                <p className="text-sm text-gray-500">
                                    Gerencie seus funcionários de forma rápida e prática.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Adicionar unidade */}
            <Link href={`/restaurant/unit/register`}>
                <Card className="hover:shadow-md transition-shadow border border-border bg-transparent">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500">
                                <Store className="h-6 w-6 text-white justify-center" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-1 text-primary">Adicionar uma nova unidade</h3>
                                <p className="text-sm text-gray-500">
                                    Adicione uma nova unidade de sua loja e tenha acesso a dados individuais.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}