export interface Planta {

    id: number,
    created_at: number,
    nom: string,
    ubicacio: {latitude: number, longitude: number},
    capacitat: number,
    user: string,
    foto?: string //?: OPCIONAL
    favorite?: boolean
}
