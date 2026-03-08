import { Planta } from './planta';

export const PLANTA_DEMO: Planta[] = [
  {
    id: 1,
    created_at: 1609459200, // Marca de temps: 1 de gener de 2021
    nom: 'Planta solar del desert',
    ubicacio: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    capacitat: 5000, // 5 MW
    user: 'admin_energia',
    foto: 'parque-soler1-1.jpg',
    favorite: true,
  },
  {
    id: 2,
    created_at: 1625097600, // Marca de temps: 1 de juliol de 2021
    nom: 'Parc eòlic de la costa nord',
    ubicacio: {
      latitude: 41.3851,
      longitude: 2.1734,
    },
    capacitat: 12000, // 12 MW
    user: 'tecnico_eolica',
    // foto és opcional, així que no està inclosa
  },
  {
    id: 3,
    created_at: 1640995200, // Marca de temps: 1 de gener de 2022
    nom: 'Instal·lació residencial López',
    ubicacio: {
      latitude: 40.4168,
      longitude: -3.7038,
    },
    capacitat: 10, // 10 kW
    user: 'jlopez',
    foto: '/fotos/instalaciones/residencial_001.jpg',
  },
  {
    id: 4,
    created_at: 1656633600, // Marca de temps: 1 de juliol de 2022
    nom: 'Centre industrial verd',
    ubicacio: {
      latitude: 39.4699,
      longitude: -0.3763,
    },
    capacitat: 7500.5, // 7.5 MW
    user: 'gestor_industrial',
  },
  {
    id: 5,
    created_at: 1672531200, // Marca de temps: 1 de gener de 2023
    nom: 'Hort solar mediterrani',
    ubicacio: {
      latitude: 36.7213,
      longitude: -4.4214,
    },
    capacitat: 3000,
    user: 'solar_med',
  },
  {
    id: 6,
    created_at: 1685577600, // Marca de temps: 1 de juny de 2023
    nom: 'Planta híbrida innovadora',
    ubicacio: {
      latitude: 43.263,
      longitude: -2.935,
    },
    capacitat: 8500,
    user: 'innovacion_energetica',
    foto: 'https://almacenamiento.com/fotos/hibrida_v1.png',
  },
];
