"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/SideMenu';
import Header from '@/components/header/Header';
import ChartCard from '@/components/cards/ChartCard';
import InformativeCard from '@/components/cards/InformativeCard';
import { ActionCards } from '@/components/dashboard/ActionCards';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Pencil, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthCheck } from '@/hooks/sessionManager';

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuthCheck();
  const router = useRouter();
  const { isOpen } = useSidebar();

  if (isLoading) {
    return <div>Loading...</div>; // Ou algum componente de carregamento
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null; // Evita renderizar o componente até o redirecionamento
  }

  return (
    <div className="flex flex-col static h-screen bg-background">
      <Header />
      <div className={cn("flex flex-col w-full transition-all duration-300", isOpen ? "ml-64" : "ml-0")}>
        <Sidebar />
        <div className="h-screen flex-1 overflow-auto bg-background">
          <div className="w-full max-w-7xl mx-auto px-6 py-4 bg-background">
            <section className="w-full mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-foreground">Ações rápidas</h2>
                <Button variant="outline" className="w-9 h-9 bg-background border-border hover:bg-muted rounded-md">
                  <Pencil size={20} className="text-foreground" />
                </Button>
              </div>
              <ActionCards />
              <div className="mt-6 text-center">
                <button className="w-full h-[34px] inline-flex justify-center items-center text-sm font-medium rounded-md text-foreground bg-background border border-border
                                hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  Ver mais ações
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            </section>
            <div className='border-b border-border mb-5' />
            <section className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-foreground">Resumo diário</h2>
                  <span className="text-sm text-muted-foreground">Um resumo rápido de todas suas unidades no dia de hoje.</span>
                </div>
                <Button variant="outline" className="w-9 h-9 bg-background hover:bg-muted border-border rounded-md">
                  <Pencil size={20} className="text-foreground" />
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard icon="circle-dollar-sign" percentValue="10,8" totalReceipt="1.531,40" />
                <InformativeCard icon="shopping-bag" canceled={8} quantity={9} inProduction={4} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}