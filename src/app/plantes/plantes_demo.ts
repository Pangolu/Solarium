import { Planta } from "./planta";

export const PLANTA_DEMO: Planta[] = [
    {
    id: 1,
    created_at: 1609459200, // Timestamp: 1 de enero de 2021
    nom: "Planta Solar del Desierto",
    ubicacio: {
        latitude: 37.7749,
        longitude: -122.4194
    },
    capacitat: 5000, // 5 MW
    user: "admin_energia",
    foto: "parque-soler1-1.jpg",
    favorite: true,
},
{
    id: 2,
    created_at: 1625097600, // Timestamp: 1 de julio de 2021
    nom: "Parque Eólico Costa Norte",
    ubicacio: {
        latitude: 41.3851,
        longitude: 2.1734
    },
    capacitat: 12000, // 12 MW
    user: "tecnico_eolica"
    // foto es opcional, así que no está incluida
},
{
    id: 3,
    created_at: 1640995200, // Timestamp: 1 de enero de 2022
    nom: "Instalación Residencial López",
    ubicacio: {
        latitude: 40.4168,
        longitude: -3.7038
    },
    capacitat: 10, // 10 kW
    user: "jlopez",
    foto: "/fotos/instalaciones/residencial_001.jpg"
},
{
    id: 4,
    created_at: 1656633600, // Timestamp: 1 de julio de 2022
    nom: "Centro Industrial Verde",
    ubicacio: {
        latitude: 39.4699,
        longitude: -0.3763
    },
    capacitat: 7500.5, // 7.5 MW
    user: "gestor_industrial"
},
{
    id: 5,
    created_at: 1672531200, // Timestamp: 1 de enero de 2023
    nom: "Huerta Solar Mediterránea",
    ubicacio: {
        latitude: 36.7213,
        longitude: -4.4214
    },
    capacitat: 3000,
    user: "solar_med"
},
{
    id: 6,
    created_at: 1685577600, // Timestamp: 1 de junio de 2023
    nom: "Planta Híbrida Innovadora",
    ubicacio: {
        latitude: 43.2630,
        longitude: -2.9350
    },
    capacitat: 8500,
    user: "innovacion_energetica",
    foto: "https://almacenamiento.com/fotos/hibrida_v1.png"
}
]