import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface FormLayoutProps {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    title: string;
    subtitle: string;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, currentStep, totalSteps, onNext, onBack, title, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-dark-background-default">
            <header className="w-80 max-w-md mx-auto mb-12">
                <Card>
                    <CardContent className="p-6 flex items-center justify-center">
                        <Image
                            src="/Logo.svg"
                            alt="Seja bem-vindo ao Seu Garçom!"
                            width={200}
                            height={50}
                            priority
                        />
                    </CardContent>
                </Card>
            </header>

            <div className="w-80 max-w-md">
                <div className="mb-8">
                    <h2 className="text-white text-xl font-medium">{title}</h2>
                    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                </div>

                <div className="mb-16">
                    {children}
                </div>

                <div className={`flex ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}>
                    {currentStep > 0 ?
                        (
                            <Button variant="default" onClick={onBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        )
                        :
                        (
                            <Button
                                type="button"
                                variant="default"
                                onClick={() => redirect('/')}
                            >
                                Voltar
                            </Button>
                        )}
                    <Button
                        variant="secondary"
                        onClick={onNext}
                        className={`${currentStep === 0 && "ml-auto"}`}
                    >
                        {currentStep === totalSteps - 1 ? (
                            "Finalizar cadastro"
                        ) : (
                            <>
                                Próximo
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FormLayout;