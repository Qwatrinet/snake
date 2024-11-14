export default class Direction {
    static HAUT = "haut"
    static BAS = "bas"
    static GAUCHE = "gauche"
    static DROITE = "droite"
}
//empeche d'ajouter une autre direction à l'enum
Object.seal(Direction)
Object.freeze(Direction)

