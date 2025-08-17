import mondayCerberus from "@/assets/mascots/monday-cerberus.jpg";
import tuesdayPhoenix from "@/assets/mascots/tuesday-phoenix.jpg";
import wednesdayFalcon from "@/assets/mascots/wednesday-falcon.jpg";
import thursdayOwl from "@/assets/mascots/thursday-owl.jpg";
import fridayPanther from "@/assets/mascots/friday-panther.jpg";
import saturdayDragon from "@/assets/mascots/saturday-dragon.jpg";
import sundayTortoise from "@/assets/mascots/sunday-tortoise.jpg";

export interface MascotData {
  name: string;
  emoji: string;
  description: string;
  image: string;
  tagline: string;
}

export const mascots: Record<number, MascotData> = {
  0: { // Sunday
    name: "Tortoise",
    emoji: "🐢",
    description: "Protector of Time",
    image: sundayTortoise,
    tagline: "Slow, Steady, Always Secure."
  },
  1: { // Monday
    name: "Cerberus",
    emoji: "🐺",
    description: "Guardian",
    image: mondayCerberus,
    tagline: "Guard the Gates, Stop the Threats."
  },
  2: { // Tuesday
    name: "Phoenix",
    emoji: "🔥",
    description: "Resilient One",
    image: tuesdayPhoenix,
    tagline: "Rise Stronger, Every Time."
  },
  3: { // Wednesday
    name: "Falcon",
    emoji: "🦅",
    description: "Hunter",
    image: wednesdayFalcon,
    tagline: "Strike Fast, Hunt Smarter."
  },
  4: { // Thursday
    name: "Owl",
    emoji: "🦉",
    description: "Watcher",
    image: thursdayOwl,
    tagline: "Stay Vigilant, See the Unseen."
  },
  5: { // Friday
    name: "Panther",
    emoji: "🐆",
    description: "Shadow Stalker",
    image: fridayPanther,
    tagline: "Silent but Always Watching."
  },
  6: { // Saturday
    name: "Dragon",
    emoji: "🐉",
    description: "Defender",
    image: saturdayDragon,
    tagline: "Breathe Fire on Rising Threats."
  }
};

export const getCurrentMascot = (date?: Date): MascotData => {
  const today = date || new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  return mascots[dayOfWeek];
};

export const getCurrentDateIST = (): string => {
  return new Date().toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};