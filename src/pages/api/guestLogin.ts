import { NextApiRequest, NextApiResponse } from "next";

type Guest = {
    cpf: string;
    email: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método não permitido." });
    }

    const { cpf, email } = req.body;

    try {
        // Valida o CPF
        if (!cpf.isValid()) {
            return res.status(400).json({ message: "CPF inválido." });
        }

        // Simula a validação do email (pode ser substituído por uma lógica real)
        if (!email || !email.includes("@")) {
            return res.status(400).json({ message: "Email inválido." });
        }

        // Retorna a rota de redirecionamento para GUEST
        return res.status(200).json({ redirectRoute: "/restaurant/order" });
    } catch (error) {
        console.error("Erro no login de convidado:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}