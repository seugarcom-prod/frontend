'use client'

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from '@/hooks/useToast';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProductStore } from "@/stores/products";
import { Separator } from "@/components/ui/separator";
import { useAuthCheck } from "@/hooks/sessionManager";

// Form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    category: z.string().min(1, { message: "Selecione uma categoria" }),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Preço deve ser um número positivo",
    }),
    description: z.string().optional(),
    quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Quantidade deve ser um número positivo",
    }),
    image: z.string().optional(),
    isAvailable: z.boolean().default(true),
    isOnPromotion: z.boolean().default(false),
    discountPercentage: z.string().optional(),
    promotionalPrice: z.string().optional(),
    promotionStartDate: z.string().optional(),
    promotionEndDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES = [
    { id: "appetizers", name: "Entradas" },
    { id: "main", name: "Pratos Principais" },
    { id: "desserts", name: "Sobremesas" },
    { id: "drinks", name: "Bebidas" },
    { id: "sides", name: "Acompanhamentos" },
];

export default function ProductForm() {
    const { restaurantId } = useParams();
    const router = useRouter();
    const { session, isAdminOrManager } = useAuthCheck();
    const { createProduct } = useProductStore();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "",
            price: "",
            description: "",
            quantity: "1",
            image: "",
            isAvailable: true,
            isOnPromotion: false,
            discountPercentage: "",
            promotionalPrice: "",
            promotionStartDate: "",
            promotionEndDate: "",
        },
    });

    const isOnPromotion = form.watch("isOnPromotion");
    const price = form.watch("price");
    const discountPercentage = form.watch("discountPercentage");

    // Calculate promotional price when discount changes
    useEffect(() => {
        if (isOnPromotion && price && discountPercentage) {
            const priceNum = Number(price);
            const discountNum = Number(discountPercentage);

            if (!isNaN(priceNum) && !isNaN(discountNum)) {
                const calculatedPrice = priceNum * (1 - discountNum / 100);
                form.setValue("promotionalPrice", calculatedPrice.toFixed(2));
            }
        }
    }, [price, discountPercentage, isOnPromotion, form]);

    // Adicione esta função para lidar com o upload da imagem
    const handleImageUpload = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    form.setValue("image", reader.result); // Armazena a imagem em formato base64
                }
            };
            reader.readAsDataURL(file); // Lê o arquivo como URL de dados
        }
    };

    async function onSubmit(values: FormValues) {
        setLoading(true);

        try {
            const token = session && session.token;
            // Format the data for API submission
            if (token) {
                const formattedData = {
                    ...values,
                    price: Number(values.price),
                    quantity: Number(values.quantity),
                    ...(values.isOnPromotion && {
                        discountPercentage: values.discountPercentage ? values.discountPercentage : undefined,
                        promotionalPrice: values.promotionalPrice ? values.promotionalPrice : undefined,
                        promotionStartDate: values.promotionStartDate || undefined,
                        promotionEndDate: values.promotionEndDate || undefined,
                    }),
                };

                // Submit to API
                await createProduct(formattedData, String(restaurantId));

                toast({
                    title: "Sucesso",
                    description: "Produto adicionado com sucesso."
                });
                router.push(`/restaurant/${restaurantId}/products`);
            }
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            toast({
                title: "Erro",
                variant: "destructive",
                description: "Erro ao cadastrar o produto."
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex flex-row items-start gap-2 mb-6">
                <h1 className="text-2xl font-bold">Novo Produto</h1>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome do produto */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do produto *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Sushi de salmão" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Categoria */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoria *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma categoria" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CATEGORIES.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Preço */}
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preço *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0,00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Quantidade */}
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantidade</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* URL da imagem */}
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Carregar imagem</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*" // Aceita apenas arquivos de imagem
                                                    onChange={handleImageUpload} // Chama a função ao selecionar um arquivo
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Selecione uma imagem do seu dispositivo (recomendado: 500x500px)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Descrição */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descreva o produto..."
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Disponibilidade */}
                                <FormField
                                    control={form.control}
                                    name="isAvailable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Disponível</FormLabel>
                                                <FormDescription>
                                                    O produto está disponível para venda
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Em promoção */}
                                <FormField
                                    control={form.control}
                                    name="isOnPromotion"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Em promoção</FormLabel>
                                                <FormDescription>
                                                    Ativar desconto promocional
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Campos condicionais de promoção */}
                            {isOnPromotion && (
                                <div className="space-y-6 mt-4 p-4 border rounded-lg bg-muted/20">
                                    <h3 className="font-medium">Detalhes da promoção</h3>
                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Percentual de desconto */}
                                        <FormField
                                            control={form.control}
                                            name="discountPercentage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Percentual de desconto (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="100"
                                                            placeholder="10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Preço promocional */}
                                        <FormField
                                            control={form.control}
                                            name="promotionalPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Preço promocional</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0,00"
                                                            {...field}
                                                            readOnly
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Calculado automaticamente com base no desconto
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Data de início */}
                                        <FormField
                                            control={form.control}
                                            name="promotionStartDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Data de início</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Data de término */}
                                        <FormField
                                            control={form.control}
                                            name="promotionEndDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Data de término</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar produto
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}