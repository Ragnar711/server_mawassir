export class CreateOfDto {
  Numero: string;
  Article: string;
  Quantite_Objectif: number;
  Debit: number;
  Recette: { name: string; percentage: number }[];
}
