// Fonction utilitaire pour récupérer et valider les champs
function getInputValue(id: string, type: "string" | "number" = "string"): string | number {
  const input = document.getElementById(id) as HTMLInputElement;
  const value = input.value.trim();
  if (type === "number") {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      alert(`Veuillez saisir un nombre valide pour ${id}`);
      return NaN;
    }
    return parsedValue;
  }
  if (!value) {
    alert(`Le champ ${id} est requis.`);
    return "";
  }
  return value;
}

// Fonction pour appliquer un coefficient de pondération selon la durée
function getPondérationDurée(month: number): number {
  if (month <= 13) return 1;
  else if (month <= 24) return 1.008;
  else if (month <= 36) return 1.059;
  else if (month <= 48) return 1.115;
  else return 1.15; // Coefficient par défaut au-delà de 48 mois
}

// Cibler le formulaire et la div résultat
const form = document.getElementById("formulaire") as HTMLFormElement;
// const resultDiv = document.getElementById("result") as HTMLElement;

// Écouteur sur le submit du formulaire
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Récupération des valeurs
  const mail = getInputValue("mail");
  if (!mail) return;

  const entreprise = getInputValue("entreprise");
  if (!entreprise) return;

  const taux = getInputValue("taux", "number");
  if (isNaN(taux)) return;

  const montant = getInputValue("montant", "number");
  if (isNaN(montant)) return;

  const month = getInputValue("month", "number");
  if (isNaN(month)) return;

  const majorationSelect = document.getElementById("majoration") as HTMLSelectElement;
  const majorationValue = majorationSelect.value;

  const typeMontant = (document.querySelector('input[name="typeMontant"]:checked') as HTMLInputElement).value;

  // Conversion et pondération
  let montantHT: number;
  let montantTTC: number;

  if (typeMontant === "HT") {
    montantHT = montant * 1.2;
    montantTTC = montantHT;
  } else {
    montantTTC = (montant * 1.2) * 1.2;
  }

  // Appliquer le coefficient de pondération
  const coefficient = getPondérationDurée(month);
  montantTTC = montantTTC * coefficient;

  // Calcul du premier loyer majoré
  let premierLoyer: number;
  if (majorationValue === "oui") {
    premierLoyer = (montantTTC / month) * 3;
  } else {
    premierLoyer = montantTTC / month;
  }

  // Montant restant après premier loyer
  const montantRestant = montantTTC - premierLoyer;
  const mensualiteSuivantes = montantRestant / (month - 1);

  // Économie d’impôt
  const economieImpots = montantTTC * (taux / 100);

  // Coût réel
  const coutReel = montantTTC - economieImpots;

  const synthese = {
    mail,
    entreprise,
    taux,
    montant,
    typeMontant,
    month,
    majoration: majorationValue,
    coefficient,
    montantTTC: montantTTC.toFixed(2),
    premierLoyer: premierLoyer.toFixed(2),
    mensualites: mensualiteSuivantes.toFixed(2),
    economieImpots: economieImpots.toFixed(2),
    coutReel: coutReel.toFixed(2)
  };

  localStorage.setItem("synthese_bail", JSON.stringify(synthese));

  // Redirection vers la page synthèse
  window.location.assign("synthese.html");



 

});
