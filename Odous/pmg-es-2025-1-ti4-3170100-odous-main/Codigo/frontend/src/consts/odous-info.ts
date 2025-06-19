type OdousInfoType = {
    name: string;
    cnpj: string;
    address: {
        street: string;
        number: string;
        complement?: string;
        district: string;
        city: string;
        state: string;
        zipCode: string;
    }
    phones: string[];
    emails: string[];
    links: Record<string, string>;
}

export const OdousInfo: OdousInfoType = {
    name: "Odous Instrumentros Ltda",
    cnpj: "02.752.847/0001-58",
    address: {
        street: "Rua Aquiral",
        number: "200",
        district: "Xangrilá",
        city: "Contagem",
        state: "MG",
        zipCode: "32.186-370"
    },
    phones: [
        "(31) 3491-8081",
        "(31) 3355-6964",
        "(31) 99884-3291"
    ],
    emails: [
        "marketing@odousinstrumentos.com.br",
        "comercialmg@odousinstrumentos.com.br"
    ],
    links: {
        website: "https://www.odousinstrumentos.com.br",
        instagam: "https://www.instagram.com/odousinstrumentos"
    }
}