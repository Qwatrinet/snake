import Serpent from "./Serpent.js";
import Pomme from "./Pomme.js";
import Obstacle from "./Obstacle.js"

export default class Grille {
    constructor(taille, nbSegments, nbObstacles) {
        this.taille = taille
        this.nbSegments = nbSegments <= this.taille / 2 - 1 ? nbSegments : this.taille / 2 - 1
        this.serpent = new Serpent(this.nbSegments, [Math.floor(this.taille / 2), Math.floor(this.taille / 2)])
        this.obstacles = []
        for (let index = 0; index < nbObstacles; index++) {
            this.obstacles.push(this.creerObstacle())
        }
        let suppr = [1]
        let maxcount = 0
        if (this.obstacles.length > 2) {
            while (suppr.length !== 0 && maxcount < 10) {
                maxcount++
                suppr = []
                suppr = this.obstacles.filter((caillou) => !this.validerNoImpasse(caillou.position))
                suppr.forEach(element => {
                    this.obstacles.splice(this.obstacles.indexOf(element),1)
                    this.obstacles.push(this.creerObstacle())
                });
            }
        }
        


        this.creerPomme()

    }

    creerPomme() {
        let valid = false
        while (valid === false) {
            this.pomme = new Pomme([Math.floor(Math.random() * (this.taille) + 1), Math.floor(Math.random() * (this.taille) + 1)])
            const valid1 = !this.serpent.segments.find((segment) => segment.position[0] === this.pomme.position[0] && segment.position[1] === this.pomme.position[1])
            const valid2 = !this.obstacles.find((caillou) => caillou?.position[0] === this.pomme.position[0] && caillou?.position[1] === this.pomme.position[1])
            valid = valid1 && valid2
        }
    }

    mangerPomme() {
        if (this.serpent.segments[0].position[0] == this.pomme.position[0] && this.serpent.segments[0].position[1] == this.pomme.position[1]) {
            this.creerPomme()

            return true
        }

        return false
    }

    validerSimple(posObstacle) {
        return !(posObstacle[0] == Math.floor(this.taille / 2) || posObstacle[0] == 1 || posObstacle[1] == 1 || posObstacle[0] == this.taille || posObstacle[1] == this.taille || this.obstacles.find((caillou) => caillou?.position[0] == posObstacle[0] && caillou?.position[1] == posObstacle[1]))
    }

    validerNoImpasse(posObstacle) {
        let diag = []
        this.obstacles?.forEach(caillou => {
            if ((caillou.position[0] == posObstacle[0] + 1 || caillou.position[0] == posObstacle[0] - 1) && (caillou.position[1] == posObstacle[1] + 1 || caillou.position[1] == posObstacle[1] - 1)) {
                diag.push(caillou.position)
            }
        });
        return !(diag.length > 2 || (diag.length == 2 && (diag[0][0] == diag[1][0] || diag[0][1] == diag[1][1])))
    }

    creerObstacle() {

        let posObstacle
        let valid = false
        while (!valid) {
            posObstacle = [Math.floor(Math.random() * (this.taille) + 1), Math.floor(Math.random() * (this.taille) + 1)]
            // verifie que l'obstacle n'est pas dans un élément ou sur le bord
            let valid1 = this.validerSimple(posObstacle)
            //empeche des situations de truite inatteignable
            let valid2 = this.validerNoImpasse(posObstacle)
            valid = valid1 && valid2

        }
        console.log(posObstacle)
        console.log(this.validerSimple(posObstacle))
        return new Obstacle(posObstacle);
    }



    collision() {
        return this.serpent.collisionSerpent() || !!this.serpent.segments.find((segment) => segment.position[0] <= 0 || segment.position[0] > this.taille || segment.position[1] <= 0 || segment.position[1] > this.taille) || !!this.obstacles.find((caillou) => caillou?.position[0] == this.serpent.segments[0].position[0] && caillou?.position[1] == this.serpent.segments[0].position[1])
    }

    avancer() {
        this.serpent.avancer()
    }
}