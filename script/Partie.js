import Direction from "./Direction.js";
import Grille from "./Grille.js";

export default class Partie {
    constructor(taille, tailleSerpent, vitesse,nbObstacles) {
        this.grille = new Grille(taille, tailleSerpent,nbObstacles)
        this.score = 0
        this.estPerdue = false
        this.pause = false
        this.nbCoups = 0
        this.vitesse = vitesse
    }

    avancer() {
        this.nbCoups++
        if (this.grille.mangerPomme()) {
            this.score++
            this.grille.serpent.ajouterSegment()
        }

        this.grille.avancer()

        if (this.grille.collision()) {
            this.estPerdue = true
        }
    }

    tick() {
        if (!this.pause) {
            this.avancer()
        }
        if (this.estPerdue) {
            return
        }

        setTimeout(() => window.requestAnimationFrame(this.tick.bind(this)), this.vitesse)
    }
}