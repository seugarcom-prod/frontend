import { BadgePercent, BarChart4, Cog, Store, Sun, UserCog } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className='h-screen flex border-r border-zinc-600'>
            <aside className='flex flex-col justify-start align-middle w-80 p-6 bg-zinc-950'>
                <nav className='flex-1 space-y-10 justify-center items-center'>
                    <a href='restaurant/users' className='flex items-center text-base text-zinc-200 gap-6'>
                        <UserCog color='#84cc16' />
                        Funcionários
                    </a>
                    <a href='restaurant/units' className='flex items-center text-base text-zinc-200 gap-6'>
                        <Store color='#d946ef' />
                        Unidades
                    </a>
                    <a href='restaurant/promotions' className='flex items-center text-base text-zinc-200 gap-6'>
                        <BadgePercent color='#f97316' />
                        Promoções
                    </a>
                    <a href='restaurant/statistics' className='flex items-center text-base text-zinc-200 gap-6'>
                        <BarChart4 color='#06b6d4' />
                        Estatísticas
                    </a>
                </nav>
                <footer className='flex flex-row mt-auto items-center justify-between'>
                    <a href="/config" className='flex flex-row gap-4 text-base'>
                        <Cog color="#ffffff" />
                        Configurações
                    </a>
                    <div className='flex flex-row gap-1'>
                        <div className='flex flex-col items-start'>
                            <span className='text-[10px]'>Tema:</span>
                            <span className='text-xs'>Escuro</span>
                        </div>
                        <button className='w-10 h-10 p-2 border border-zinc-600 rounded-lg leading-none'>
                            <Sun color='white' size={22} />
                        </button>
                    </div>
                </footer>
            </aside>
        </div>
    )
}
