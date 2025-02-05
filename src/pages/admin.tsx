import Sidebar from '@/components/sidebar';
import { Bell, Menu, Pencil } from 'lucide-react';
import SimpleCard from '@/components/cards/SimpleCard';
import ChartCard from '@/components/cards/ChartCard';
import InformativeCard from '@/components/cards/InformativeCard';
import OperationsCard from '@/components/cards/OperationsCard';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Admin() {  // Adicionado async
  const session = await getServerSession(); // Adicionado await

  /* if (!session) {
    redirect("/")
  } */

  function addUnit() {
    redirect('/restaurant/unit/add');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className='flex items-center justify-between bg-zinc-950 px-4 py-8 border-b border-zinc-600'>
        <button className='w-10 h-10 p-2 border border-zinc-600 rounded-lg leading-none'>
          <Menu color='white' size={22} />
        </button>
        <span className="text-xl">Restaurante do Ecaflip Bêbado</span>
        <button className='w-10 h-10 p-2 border border-zinc-600 rounded-lg leading-none'>
          <Bell color='white' size={22} />
        </button>
      </header>

      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1'>
          <div className='divide-y divide-zinc-600'>
            <div className='p-6 bg-zinc-950'>
              <header className='mb-4 px-3 flex items-center justify-between'>
                <span className='text-lg'>Ações rápidas</span>
                <button className='w-10 h-10 p-2 border border-zinc-600 rounded-lg leading-none'>
                  <Pencil color='white' size={22} />
                </button>
              </header>
              <div className='grid grid-cols-2 gap-2 px-3'>
                <SimpleCard
                  icon='user-cog'
                  backgroundColor='bg-lime-500'
                  title='Gerenciar funcionários'
                  description='Gerencie seus funcionários de forma rápida e prática.'
                  onClick={() => redirect('/restaurant/register')}
                />
                <SimpleCard
                  icon='store'
                  backgroundColor='bg-fuchsia-500'
                  title='Adicionar uma nova unidade'
                  description='Adicione uma nova unidade de sua loja e tenha acesso a dados individuais.'
                  onClick={addUnit}
                />
              </div>
            </div>


            <div className='p-6 bg-zinc-950'>
              <header className='mb-4 px-3 flex items-center justify-between'>
                <div className='space-y-1'>
                  <span className='text-lg'>Resumo diário</span>
                  <p className='text-sm text-zinc-500'>Um resumo diário de todas as suas unidades no dia de hoje.</p>
                </div>
                <button className='w-10 h-10 p-2 border border-zinc-600 rounded-lg leading-none'>
                  <Pencil color='white' size={22} />
                </button>
              </header>

              <div className='grid grid-cols-2 gap-4'>
                <ChartCard
                  title='Faturamento'
                  backgroundColor='bg-green-600'
                  chartDescription='Faturamento dos últimos 6 meses'
                  icon='circle-dollar-sign'
                  percentValue='10,8'
                  totalReceipt='1.531,40'
                />
                <div className='grid grid-rows-2 gap-2'>
                  <InformativeCard
                    title='Pedidos'
                    backgroundColor='bg-cyan-600'
                    chartDescription='Quantidade de pedidos realizados nos últimos 6 meses'
                    icon='shopping-bag'
                    canceled={4}
                    quantity={13}
                    inProduction={6}
                  />
                  <OperationsCard
                    title='Promoções'
                    backgroundColor='bg-orange-600'
                    icon='badge-percent'
                    canceled={4}
                    quantity={13}
                    inProduction={6}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}