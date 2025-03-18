import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

interface User {
    email?: string;
    cpf?: string;
    password: string;
    role?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            id: 'credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                cpf: { label: "Cpf", type: "text" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials: Partial<Record<"email" | "password" | "cpf" | "role", unknown>>) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email e senha são necessários")
                }

                try {
                    const user: User = {
                        email: credentials.email as string,
                        cpf: credentials.cpf as string,
                        password: credentials.password as string,
                        role: 'CLIENT',
                    };
                    return user;
                } catch (error) {
                    return null
                }
            }
        }),
        CredentialsProvider({
            id: 'guest',
            credentials: {},
            async authorize() {
                // Cria um usuário convidado com permissões limitadas
                return {
                    id: 'guest',
                    name: 'Convidado',
                    email: 'guest@example.com',
                    role: 'GUEST'
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/auth/error'
    },
    secret: process.env.NEXTAUTH_SECRET
})
