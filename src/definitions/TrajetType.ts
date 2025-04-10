export type TrajetType = {
  id: number;
  numeroVoyage: string;
  nomNavire: string;
  abreviationNavire: string;
  archipelDestinationDepart: string;
  archipelDestinationArrivee: string;
  destinationDepart: string;
  dateDepart: string;
  heureDepart: string;
  destinationArrivee: string;
  dateArrivee: string;
  heureArrivee: string;
  dateDepartVoyage: string;
  dateRetourVoyage: string;
  croisiere: boolean;
  codeZoneTarifaireArrivee: string;
};
