"use client";

export default function UnitSuccessScreen() {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 6L9 17L4 12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <h2 className="text-2xl font-medium mb-4">Unidade criada com sucesso</h2>

            <p className="text-gray-600 max-w-lg">
                Agora você pode gerenciar sua unidade de forma completa e eficiente.
                Através do sistema, é possível visualizar estatísticas detalhadas de
                desempenho, criar e atualizar o cardápio, adicionar e gerenciar
                funcionários, além de ajustar o horário de funcionamento conforme
                necessário. Tudo isso de forma integrada, garantindo mais praticidade
                e controle na administração do seu negócio.
            </p>
        </div>
    );
}