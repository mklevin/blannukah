import { Author } from "@/app/lib/types/author";

const BASE_PATH = process.env.PAGES_BASE_PATH ?? "";

export function publicPath(path: string) {
  return `${BASE_PATH}${path}`;
}

export const Brie: Author = {
  name: "Brie Wright",
  jobTitle: "Part-Time Gamer",
  image: publicPath("/images/authors/brie.jpeg"),
  credit: "Charlotte Wright"
}

export const Circe: Author = {
  name: "Circe the Witchy Girl",
  jobTitle: "Chief Food Officer",
  image: publicPath("/images/authors/circe.jpeg"),
  credit: "Aimee Goldstein"
}

export const Colby: Author = {
  name: "Colby Wright",
  jobTitle: "Gravity Tester",
  image: publicPath("/images/authors/colby.jpeg"),
  credit: "Charlotte Wright"
}

export const KitKat: Author = {
  name: "KitKat",
  jobTitle: "Pretty Privilege Exemplar",
  image: publicPath("/images/authors/kitkat.jpg"),
  credit: "Andrew Truong"
}

export const Zoidberg: Author = {
  name: "Zoidberg Cooper",
  jobTitle: "MLB Umpire",
  image: publicPath("/images/authors/zoidberg.jpg"),
  credit: "Emily Cooper"
}

export const AllAuthors = [Brie, Circe, Colby, KitKat, Zoidberg];