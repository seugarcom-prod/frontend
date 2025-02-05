import { NextApiRequest, NextApiResponse } from "next";

type User = {
    email: string;
    password: string;
    role: "ADMIN" | "ATTENDANT" | "CLIENT";
};

const users: User[] = [
    { email: "admin@example.com", password: "admin123", role: "ADMIN" },
    { email: "attendant@example.com", password: "attendant123", role: "ATTENDANT" },
    { email: "client@example.com", password: "client123", role: "CLIENT" },
];

export default async function userLoginHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método não permitido." });
    }

    const { email, password } = req.body;

    try {
        // Simula a busca do usuário no banco de dados
        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // Define a rota de redirecionamento com base na role
        let redirectRoute = "";
        switch (user.role) {
            case "ADMIN":
                redirectRoute = "/dashboard";
                break;
            case "ATTENDANT":
                redirectRoute = "/unit";
                break;
            case "CLIENT":
                redirectRoute = "/restaurant/order";
                break;
            default:
                redirectRoute = "/restaurant/order"; // Rota padrão para roles desconhecidas
        }

        // Retorna a rota de redirecionamento
        return res.status(200).json({ redirectRoute });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}