import { jsPDF } from "jspdf";

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
function getPonderationDuree(month: number): number {
  if (month <= 13) return 1;
  else if (month <= 24) return 1.008;
  else if (month <= 36) return 1.059;
  else if (month <= 48) return 1.115;
  else return 1.15; // Coefficient par défaut au-delà de 48 mois
}

// Cibler le formulaire et la div résultat
const form = document.getElementById("formulaire") as HTMLFormElement;

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
  let montantTTC: number;
  if (typeMontant === "HT") {
    montantTTC = montant * 1.2;
  } else {
    montantTTC = montant * 1.44; // 1.2 * 1.2
  }

  // Appliquer le coefficient de pondération
  const coefficient = getPonderationDuree(month);
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

  // Stockage des données en localStorage
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

  // Stocker les données
  localStorage.setItem("synthese_bail", JSON.stringify(synthese));

  // Afficher le résumé dans le HTML
  document.getElementById("mailResult")!.textContent = mail;
  document.getElementById("entrepriseResult")!.textContent = entreprise;
  document.getElementById("tauxResult")!.textContent = `${taux}%`;
  document.getElementById("montantResult")!.textContent = `${montant} €`;
  document.getElementById("monthResult")!.textContent = `${month}`;
  document.getElementById("majorationResult")!.textContent = majorationValue === "oui" ? "Oui" : "Non";
  document.getElementById("typeMontantResult")!.textContent = typeMontant === "HT" ? "Hors Taxes" : "TTC";
  document.getElementById("montantTTCResult")!.textContent = `${montantTTC.toFixed(2)} €`;
  document.getElementById("premierLoyerResult")!.textContent = `${premierLoyer.toFixed(2)} €`;
  document.getElementById("mensualitesResult")!.textContent = `${mensualiteSuivantes.toFixed(2)} €`;
  document.getElementById("economieImpotsResult")!.textContent = `${economieImpots.toFixed(2)} €`;
  document.getElementById("coutReelResult")!.textContent = `${coutReel.toFixed(2)} €`;
});

// Fonction pour générer le PDF
function generatePDF() {
  const doc = new jsPDF();
  doc.text("Résumé du Bail", 20, 10);
  doc.text("Nom: " + document.getElementById("mailResult")!.textContent, 20, 20);
  doc.text("Entreprise: " + document.getElementById("entrepriseResult")!.textContent, 20, 30);
  doc.text("Taux d'Imposition: " + document.getElementById("tauxResult")!.textContent, 20, 40);
  doc.text("Montant du Bien: " + document.getElementById("montantResult")!.textContent, 20, 50);
  doc.text("Durée du Bail: " + document.getElementById("monthResult")!.textContent + " mois", 20, 60);
  doc.text("Majoration du Premier Loyer: " + document.getElementById("majorationResult")!.textContent, 20, 70);
  doc.text("Type de Montant: " + document.getElementById("typeMontantResult")!.textContent, 20, 80);
  doc.text("Montant du Bail (TTC): " + document.getElementById("montantTTCResult")!.textContent + " €", 20, 90);
  doc.text("Première Mensualité: " + document.getElementById("premierLoyerResult")!.textContent + " €", 20, 100);
  doc.text("Mensualités Suivantes: " + document.getElementById("mensualitesResult")!.textContent + " €", 20, 110);
  doc.text("Économie d'Impôt: " + document.getElementById("economieImpotsResult")!.textContent + " €", 20, 120);
  doc.text("Coût Réel: " + document.getElementById("coutReelResult")!.textContent + " €", 20, 130);
  doc.save("resultat_bail.pdf");
}
