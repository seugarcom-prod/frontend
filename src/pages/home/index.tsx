import HomeNavigationMenu from "@/components/NavigationMenu/HomeNavigationMenu";

export default function HomePage() {
    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex flex-col justify-center items-center">
                <HomeNavigationMenu />
            </div>
            <div className="flex flex-col m-auto justify-center items-center gap-4 w-full h-96">
                <label className="text-4xl font-semibold">SEU GARÇOM</label>
                <h3>Seja bem vindo ao sistema de interface de testes Seu Garçom</h3>
                <p>Selecione uma das opções acima.</p>
            </div>
        </div>
    )
}