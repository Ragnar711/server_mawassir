import { Historique } from 'src/historique/entities/historique.entity';

export class Machine {
  KPIs: {
    TD: number;
    TP: number;
    TQ: number;
    TRS: number;
    historique: {
      Date: string;
      TD: number;
      TP: number;
      TQ: number;
      TRS: number;
    }[];
  };
  OF: {
    NOF: string;
    Article: string;
    QO: number;
    QP: number;
    QNC: number;
    QD: number;
    Debit: number;
  };
  Params: {
    VE: number;
    VT: number;
    PM: number;
    Debit: number;
  };
  ParetoNC: { Type: string; Quantite: number }[];
  ParetoDechet: { Type: string; Quantite: number }[];
  ParetoArret: { Cause: string; Duree: number }[];
  historique: Historique[];
}
