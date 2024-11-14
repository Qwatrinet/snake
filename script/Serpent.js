import Segment from "./Segment.js";
import Direction from "./Direction.js";

export default class Serpent {
    constructor(nbSegments, posInit) {
        this.segments = []
        this.segments.push(new Segment(posInit, Direction.DROITE))
        for (let index = 1; index < nbSegments; index++) {
            this.segments.push(new Segment([posInit[0], posInit[1] - index], Direction.DROITE))
        }

    }

    ajouterSegment() {
        const lastSeg = this.segments[this.segments.length - 1] // lag lol
        switch (lastSeg.direction) {
            case Direction.DROITE:
                this.segments.push(new Segment([lastSeg.position[0], lastSeg.position[1] - 1], Direction.DROITE))
                break;
            case Direction.GAUCHE:
                this.segments.push(new Segment([lastSeg.position[0], lastSeg.position[1] + 1], Direction.GAUCHE))
                break;
            case Direction.HAUT:
                this.segments.push(new Segment([lastSeg.position[0] + 1, lastSeg.position[1]], Direction.HAUT))
                break; //le repère est à 0 en haut à gauche et y augmente quand on va vers le bas
            case Direction.BAS:
                this.segments.push(new Segment([lastSeg.position[0] - 1, lastSeg.position[1]], Direction.BAS))
                break;
            default:
                break;
        }
    }

    collisionSerpent() {
        return !!this.segments.find(segment => segment !== this.segments[0] && segment.position[0] === this.segments[0].position[0] && segment.position[1] === this.segments[0].position[1])
    }

    avancer() {
        this.segments.forEach(segment => {
            switch (segment.direction) {
                case Direction.DROITE:
                    segment.position[1] += 1
                    break;
                case Direction.GAUCHE:
                    segment.position[1] -= 1
                    break;
                case Direction.HAUT:
                    segment.position[0] -= 1
                    break;
                case Direction.BAS:
                    segment.position[0] += 1
                    break;
                default:
                    break;
            }
        });
        for (let index = this.segments.length - 1; index > 0; index--) {
            this.segments[index].direction = this.segments[index - 1].direction //fait tourner le serpent si nécessaire           
        }
    }

    changerDirection(direction) {
        this.segments[0].direction = direction
    }
}