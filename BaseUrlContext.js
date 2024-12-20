import React, { createContext, useState, useEffect } from 'react';

export const BaseUrlContext = createContext();
export const UserDataContext = createContext(); // Create another context

export const BaseUrlProvider = ({ children }) => {
<<<<<<< HEAD
    const [baseUrl, setBaseUrl] = useState('https://fcb6-2405-201-c01d-402a-c526-9206-83b2-c9bc.ngrok-free.app');
=======
    const [baseUrl, setBaseUrl] = useState('https://733e-2405-201-c01d-402a-7542-d3b8-cd1c-1bce.ngrok-free.app');
>>>>>>> d1af1d228b9f6385c24b1c491145966f02b48d9f
    const [userData, setUserData] = useState(''); // State for another context

    // useEffect(() => {
    //     const loadConfig = async () => {
    //         try {
    //             const response = await fetch('https://drive.google.com/uc?id=106BXNjo0tgpHl4PucP-NRA2sCF64FPCD');
    //             const config = await response.json();
    //             setBaseUrl(config.baseUrl);
    //             console.log(config.baseUrl);
    //         } catch (error) {
    //             console.error('Error loading config:', error);
    //         }
    //     };

    //     loadConfig();
    // }, []);

    return (
        <BaseUrlContext.Provider value={baseUrl}>
            <UserDataContext.Provider value={{ userData, setUserData }}>
                {children}
            </UserDataContext.Provider>
        </BaseUrlContext.Provider>
    );
};