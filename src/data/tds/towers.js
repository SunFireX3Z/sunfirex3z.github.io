import FarmImage from "@/assets/images/tds/farm.webp"
import CommanderImage from "@/assets/images/tds/commander.webp"
import DJImage from "@/assets/images/tds/dj_booth.webp"
import RangerImage from "@/assets/images/tds/ranger.webp"
import MinigunnerImage from "@/assets/images/tds/minigunner.webp"
import CowboyImage from "@/assets/images/tds/cowboy.webp"
import AcceleratorImage from "@/assets/images/tds/accelerator.webp"
import EngineerImage from "@/assets/images/tds/engineer.webp";
import SoldierImage from "@/assets/images/tds/soldier.webp";
import ScoutImage from "@/assets/images/tds/scout.webp";
import DemomanImage from "@/assets/images/tds/demoman.webp";
import PyroImage from "@/assets/images/tds/pyro.webp";

export const towers = {
    Farm: {
        name: "Farm",
        image: FarmImage,
        role: "Support",
    },
    Commander: {
        name: "Commander",
        image: CommanderImage,
        role: "Support",
    },
    "DJ Booth": {
        name: "DJ Booth",
        image: DJImage,
        role: "Support",
    },
    Ranger: {
        name: "Ranger",
        image: RangerImage,
        role: "DPS (Cliff)",
    },
    Minigunner: {
        name: "Minigunner",
        image: MinigunnerImage,
        role: "DPS (Ground)",
    },
    Cowboy: {
        name: "Cowboy",
        image: CowboyImage,
        role: "Offense",
    },
    Accelerator: {
        name: "Accelerator",
        image: AcceleratorImage,
        role: "DPS (Ground)",
    },
    Engineer: {
        name: "Engineer",
        image: EngineerImage,
        role: "DPS (Ground)",
    },
    Soldier: {
        name: "Soldier",
        image: SoldierImage,
        role: "DPS (Ground)",
    },
    Scout: {
        name: "Scout",
        image: ScoutImage,
        role: "Early Game",
    },
    Demoman: {
        name: "Demoman",
        image: DemomanImage,
        role: "DPS (Cliff)",
    },
    Pyro: {
        name: "Pyro",
        image: PyroImage,
        role: "DPS (Ground)",
    }
}