// BaseUrlContext.js
import React, { createContext, useState, useEffect } from 'react';

export const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children }) => {
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const response = await fetch('https://drive.google.com/uc?id=106BXNjo0tgpHl4PucP-NRA2sCF64FPCD');
                const config = await response.json();
                setBaseUrl(config.baseUrl);
                console.log(config.baseUrl);
            } catch (error) {
                console.error('Error loading config:', error);
            }
        };

        loadConfig();
    }, []);

    return (
        <BaseUrlContext.Provider value={baseUrl}>
            {children}
        </BaseUrlContext.Provider>
    );
};