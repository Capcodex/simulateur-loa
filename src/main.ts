function getInputValue(id: string): string {
  const input = document.getElementById(id) as HTMLInputElement;
  return input?.value.trim() ?? '';
}

// Fonction pour appliquer un coefficient de pondération selon la durée
function getPonderationDuree(month: number): number {
  if (month <= 13) return 1;
  else if (month <= 24) return 1.008;
  else if (month <= 36) return 1.059;
  else if (month <= 48) return 1.115;
  else return 1.15; // Coefficient par défaut au-delà de 48 mois
}

document.getElementById('formulaire')?.addEventListener('submit', (event) => {
  event.preventDefault();

  const mail = getInputValue('mail');
  const entreprise = getInputValue('entreprise');
  const taux = parseFloat(getInputValue('taux'));
  const montant = parseFloat(getInputValue('montant'));
  const month = parseInt(getInputValue('month'));
  const majorationValue = (document.getElementById('majoration') as HTMLSelectElement).value;
  const typeMontant = (document.querySelector('input[name="typeMontant"]:checked') as HTMLInputElement).value;

  if (!mail || !entreprise || isNaN(taux) || isNaN(montant) || isNaN(month)) {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }

  // Calcul du montant TTC
  let montantTTC = typeMontant === 'HT' ? montant * 1.2 : montant;

  // Appliquer le coefficient de pondération basé sur la durée
  const coefficient = getPonderationDuree(month);
  montantTTC = montantTTC * coefficient;

  // Calcul du premier loyer majoré ou non
  const premierLoyer = majorationValue === 'oui' ? (montantTTC / month) * 3 : montantTTC / month;

  // Calcul des mensualités restantes
  const mensualites = (montantTTC - premierLoyer) / (month - 1);

  // Calcul de l'économie d'impôts et du coût réel
  const economieImpots = montantTTC * (taux / 100);
  const coutReel = montantTTC - economieImpots;

  // Affichage des résultats
  (document.getElementById('result') as HTMLElement).style.display = 'block';
  (document.getElementById('mailResult') as HTMLElement).textContent = mail;
  (document.getElementById('entrepriseResult') as HTMLElement).textContent = entreprise;
  (document.getElementById('tauxResult') as HTMLElement).textContent = `${taux}%`;
  (document.getElementById('montantResult') as HTMLElement).textContent = `${montant.toFixed(2)} €`;
  (document.getElementById('monthResult') as HTMLElement).textContent = `${month}`;
  (document.getElementById('majorationResult') as HTMLElement).textContent = majorationValue === 'oui' ? 'Oui' : 'Non';
  (document.getElementById('typeMontantResult') as HTMLElement).textContent = typeMontant;
  (document.getElementById('montantTTCResult') as HTMLElement).textContent = montantTTC.toFixed(2);
  (document.getElementById('premierLoyerResult') as HTMLElement).textContent = premierLoyer.toFixed(2);
  (document.getElementById('mensualitesResult') as HTMLElement).textContent = mensualites.toFixed(2);
  (document.getElementById('economieImpotsResult') as HTMLElement).textContent = economieImpots.toFixed(2);
  (document.getElementById('coutReelResult') as HTMLElement).textContent = coutReel.toFixed(2);
});
