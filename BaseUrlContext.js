import React, { createContext, useState, useEffect } from 'react';

export const BaseUrlContext = createContext();
export const UserDataContext = createContext(); // Create another context

export const BaseUrlProvider = ({ children }) => {
    const [baseUrl, setBaseUrl] = useState('https://4fbc-2405-201-c01d-402a-cc22-a956-8fb2-5347.ngrok-free.app');
    const [userData, setUserData] = useState(''); // State for another context

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
            <UserDataContext.Provider value={{ userData, setUserData }}>
                {children}
            </UserDataContext.Provider>
        </BaseUrlContext.Provider>
    );
};