import Partie from './Partie.js'
import Direction from './Direction.js'

const app = {
    data() {
        return {
            partie: null,
            timerPause: "En Pause",
            taille: 8,
            nbSegments: 5,
            vitesse: 400,
            qteObstacles: "Aucun",
            skins: [],
            vestiaire: false,
            skinSerpent: "Anguille",
            skinPomme: "LaTruite",
            skinObstacle: "Mine"
        }
    },
    computed: {
        grilleStyle() {
            return {
                'grid-template-columns': `repeat(${this.taille}, 1fr)`,
                '--_skin-serpent': `url('./img/${this.skinSerpent}.png')`,
                '--_skin-pomme': `url('./img/${this.skinPomme}.png')`,
                '--_skin-obstacle': `url('./img/${this.skinObstacle}.png')`,

            }
        },

        score() {
            return this.partie.score
        },
        nbCoups() {
            return this.partie.nbCoups
        },
        cellStyle() {
            let dir
            switch (this.partie.grille.serpent.segments[0].direction) {
                case Direction.DROITE:
                    dir = 180
                    break;
                case Direction.GAUCHE:
                    dir = 0
                    break;
                case Direction.HAUT:
                    dir = 90
                    break;
                case Direction.BAS:
                    dir = 270
                    break;
                default:
                    dir = 0
                    break;
            }
            return {
                height: (33 / this.taille) + 'vw',
                width: (33 / this.taille) + 'vw'
            }
        },


    },
    methods: {
        nbObstacles() {

            switch (this.qteObstacles) {
                case "Aucun":
                    return 0
                case "Un peu":
                    if (this.taille < 8) {
                        return 2
                    }
                    else if (this.taille == 8) {
                        return 10
                    }
                    else {
                        return 20
                    }
                case "Beaucoup":
                    if (this.taille < 8) {
                        return 4
                    }
                    else if (this.taille == 8) {
                        return 20
                    }
                    else {
                        return 40
                    }
            }
        },
        demarrerPartie() {
            localStorage.setItem("taille", this.taille)
            localStorage.setItem("nbSegments", this.nbSegments)
            localStorage.setItem("vitesse", this.vitesse)
            localStorage.setItem("qteObstacles", this.qteObstacles)
            localStorage.setItem("skinSerpent", this.skinSerpent)
            localStorage.setItem("skinPomme", this.skinPomme)
            localStorage.setItem("skinObstacle", this.skinObstacle)
            if (this.timerPause !== 0 && this.timerPause !== 'En Pause') {
                return
            }
            this.vestiaire = false

            this.partie = new Partie(this.taille, this.nbSegments, this.vitesse, this.nbObstacles())
            this.partie.pause = true
            this.timerPause = 3
            setTimeout(() => this.timerPause = 2, 1000)
            setTimeout(() => this.timerPause = 1, 2000)
            setTimeout(() => this.timerPause = 0, 3000)
            setTimeout(() => this.partie.pause = false, 3000)
            window.requestAnimationFrame(this.partie.tick.bind(this.partie))

        },
        pause() {
            if (this.timerPause !== 0 && this.timerPause !== 'En Pause') {
                return
            }
            if (this.partie.pause) {
                this.timerPause = 3
                setTimeout(() => this.timerPause = 2, 1000)
                setTimeout(() => this.timerPause = 1, 2000)
                setTimeout(() => this.timerPause = 0, 3000)
                setTimeout(() => this.partie.pause = false, 3000)
            }
            else {
                this.partie.pause = true
                this.timerPause = "En Pause"
            }


        },
        retour() {
            this.partie = null;
        },
        changeDirection(e) {
            if (this.partie.pause) {
                return
            }
            switch (e.key) {
                case "ArrowRight":
                    this.partie.grille.serpent.segments[0].changerDirection(Direction.DROITE)
                    break;
                case "ArrowLeft":
                    this.partie.grille.serpent.segments[0].changerDirection(Direction.GAUCHE)
                    break;
                case "ArrowUp":
                    this.partie.grille.serpent.segments[0].changerDirection(Direction.HAUT)
                    break;
                case "ArrowDown":
                    this.partie.grille.serpent.segments[0].changerDirection(Direction.BAS)
                    break;
            }
        },
        isSerpent(x, y) {
            return !!this.partie?.grille.serpent.segments.find((segment) => segment.position[0] == x && segment.position[1] == y)
        },
        isObstacle(x, y) {
            return !!this.partie?.grille.obstacles.find((caillou) => caillou.position[0] == x && caillou.position[1] == y)
        },
        isPomme(x, y) {
            return (this.partie?.grille.pomme.position[0] == x && this.partie?.grille.pomme.position[1] == y)
        },
        isTete(x, y) {
            return (this.partie?.grille.serpent.segments[0].position[0] == x && this.partie?.grille.serpent.segments[0].position[1] == y)
        },
        isDroite() {
            return (this.partie?.grille.serpent.segments[0].direction == Direction.DROITE)
        },
        isGauche() {
            return (this.partie?.grille.serpent.segments[0].direction == Direction.GAUCHE)
        },
        isHaut() {
            return (this.partie?.grille.serpent.segments[0].direction == Direction.HAUT)
        },
        isBas() {
            return (this.partie?.grille.serpent.segments[0].direction == Direction.BAS)
        },
        ouvrirVestiaire() {
            this.vestiaire = true
        },
        listerSkin() {
            let serp = []
            let pom = []
            let obs = []
            this.skins.forEach(skin => {
                switch (skin.type) {
                    case "serpent":
                        serp.push(skin.nom)
                        break;
                    case "pomme":
                        pom.push(skin.nom)
                        break;
                    case "obstacle":
                        obs.push(skin.nom)
                        break;
                    default:
                        break;
                }
            })
            console.log(serp)
            return [serp, pom, obs]
        }
    },
    async mounted() {
        window.addEventListener('keydown', this.changeDirection)

        this.taille = localStorage.getItem("taille") ?? 8
        this.nbSegments = localStorage.getItem("nbSegments") ?? 3
        this.vitesse = localStorage.getItem("vitesse") ?? 400
        this.qteObstacles = localStorage.getItem("qteObstacles") ?? "Aucun"
        this.skinSerpent = localStorage.getItem("skinSerpent") ?? "Anguille"
        this.skinPomme = localStorage.getItem("skinPomme") ?? "LaTruite"
        this.skinObstacle = localStorage.getItem("skinObstacle") ?? "Mine"
        this.skins = await (await fetch('/json/skins.json')).json()

    }
}

Vue.createApp(app).mount('body')