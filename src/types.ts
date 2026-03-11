export type Category = 
  | "Logo Design"
  | "Illustration"
  | "CX Design"
  | "Print Design"
  | "Ad Design"
  | "Package Design"
  | "Business Card";

export interface Project {
  id: string;
  title: string;
  category: Category;
  thumbnail: string;
  description: string;
  client: string;
  needs: string;
  solution: string;
  colorPalette: string[];
  typography: string[];
  images: string[];
}
