"use client"

import React, { useState } from 'react';
import FormLayout from './FormLayout';
import RestaurantManagerFormOne from '@/components/forms/restaurantManager/unit/FormOne';
import RestaurantManagerFormTwo from '@/components/forms/restaurantManager/unit/FormTwo';

const FirstStep = () => {
    return (
        <div className="space-y-4">
            <RestaurantManagerFormOne />
        </div>
    );
};

const SecondStep = () => {
    return (
        <div className="space-y-4">
            <RestaurantManagerFormTwo />
        </div>
    );
};

const RegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const STEPS = [
        {
            component: FirstStep,
            title: "Informações da unidade",
            subtitle: "Informe os dados do seu negócio."
        },
        {
            component: SecondStep,
            title: "Endereço da unidade",
            subtitle: "Preencha as informações de endereço da sua loja."
        },
    ];

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const CurrentStepComponent = STEPS[currentStep].component;

    return (
        <FormLayout
            currentStep={currentStep}
            totalSteps={STEPS.length}
            onNext={handleNext}
            onBack={handleBack}
            title={STEPS[currentStep].title}
            subtitle={STEPS[currentStep].subtitle}
        >
            <CurrentStepComponent />
        </FormLayout>
    );
};

export default RegistrationForm;