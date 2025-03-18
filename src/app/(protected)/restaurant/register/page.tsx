"use client"

import React, { useState } from 'react';
import FormLayout from './FormLayout';
import RestaurantManagerFormOne from '@/components/forms/restaurantManager/FormOne';
import RestaurantManagerFormTwo from '@/components/forms/restaurantManager/FormTwo';
import RestaurantManagerFormThree from '@/components/forms/restaurantManager/FormThree';
import RestaurantManagerFormFour from '@/components/forms/restaurantManager/FormFour';

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

const ThirdStep = () => {
    return (
        <div className='space-y-4'>
            <RestaurantManagerFormThree />
        </div>
    );
}

const FourthStep = () => {
    return (
        <div className='space-y-4'>
            <RestaurantManagerFormFour />
        </div>
    );
}

const RegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const STEPS = [
        {
            component: FirstStep,
            title: "Crie sua conta",
            subtitle: "Informe os dados da pessoa que tem o nome no contrato social da empresa"
        },
        {
            component: SecondStep,
            title: "Crie sua conta",
            subtitle: "Informe os dados do seu negócio"
        },
        {
            component: ThirdStep,
            title: "Crie sua conta",
            subtitle: "Informe os dados do seu negócio"
        },
        {
            component: FourthStep,
            title: "Crie sua conta",
            subtitle: "Informe os dados para acessar sua loja em nossa plataforma."
        }
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