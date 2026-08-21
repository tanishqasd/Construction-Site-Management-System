import { apiRequest } from "./api";

export interface MaterialItem {
  _id: string;
  materialName: string;
  category: "Cement" | "Steel" | "Bricks" | "Sand" | "Gravel" | "Paint" | "Electrical" | "Plumbing" | "Other";
  quantity: number;
  unit: "Kg" | "Ton" | "Bag" | "Piece" | "Litre" | "Cubic Meter";
  costPerUnit: number;
  site: { _id: string; siteName: string };
  createdAt: string;
}

export const fetchMaterials = () =>
  apiRequest<{ count: number; materials: MaterialItem[] }>("/materials");

export const createMaterial = (data: Partial<MaterialItem>) =>
  apiRequest<{ message: string; material: MaterialItem }>("/materials", {
    method: "POST",
    body: JSON.stringify(data),
  });