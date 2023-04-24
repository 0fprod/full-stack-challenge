import { UpdateMonsterDTO } from '../dto';
import { CreateMonsterDto } from '../dto/CreateMonsterDto';

export class MonsterName {
  title: string;
  first: string;
  last: string;

  constructor(title: string, first: string, last: string) {
    this.title = title;
    this.first = first;
    this.last = last;
  }
}

export class Monster {
  id: string;
  name: MonsterName;
  nationality: string[];
  gender: string;
  description: string;
  imageUrl: string;
  goldBalance: number;
  speed: number;
  health: number;
  secretNotes: string;
  monsterPassword: string;

  constructor(
    name: MonsterName,
    nationality: string[],
    gender: string,
    description: string,
    imageUrl: string,
    speed: number,
    health: number,
    secretNotes: string,
    monsterPassword: string,
  ) {
    this.name = name;
    this.nationality = nationality;
    this.gender = gender;
    this.description = description;
    this.imageUrl = imageUrl;
    this.speed = speed;
    this.health = health;
    this.secretNotes = secretNotes;
    this.monsterPassword = monsterPassword;
  }

  public static fromCreateMonsterDTO(dto: CreateMonsterDto): Monster {
    const name = new MonsterName(dto.title, dto.firstName, dto.lastName);
    const nationality = [...dto.nationality];
    const gender = dto.gender;
    const description = dto.description;
    const imageUrl = dto.imageUrl;
    const speed = dto.speed;
    const health = dto.health;
    const secretNotes = dto.secretNotes;
    const monsterPassword = dto.monsterPassword;

    return new Monster(name, nationality, gender, description, imageUrl, speed, health, secretNotes, monsterPassword);
  }

  public static fromUpdateMonsterDTO(dto: UpdateMonsterDTO): Partial<Monster> {
    const name = new MonsterName(dto.title, dto.firstName, dto.lastName);
    const nationality = dto.nationality;
    const gender = dto.gender;
    const description = dto.description;
    const imageUrl = dto.imageUrl;
    const speed = dto.speed;
    const health = dto.health;
    const secretNotes = dto.secretNotes;
    const monsterPassword = dto.monsterPassword;

    const monsterEntitiy: Partial<Monster> = {
      id: dto.id,
      name,
      nationality,
      gender,
      description,
      imageUrl,
      speed,
      health,
      secretNotes,
      monsterPassword,
    };

    return JSON.parse(JSON.stringify(monsterEntitiy));
  }
}
