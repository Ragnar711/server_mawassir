export class Management {
  KPIs: {
    Date: string;
    TD: number;
    TQ: number;
    TP: number;
    TRS: number;
  }[];
  NC: {
    Type: string;
    Quantite: number;
  }[];
  Dechet: {
    Type: string;
    Quantite: number;
  }[];
  Arret: {
    Cause: string;
    Duree: number;
  }[];
}
