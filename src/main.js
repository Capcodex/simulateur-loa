var _a;
function getInputValue(id) {
    var _a;
    var input = document.getElementById(id);
    return (_a = input === null || input === void 0 ? void 0 : input.value.trim()) !== null && _a !== void 0 ? _a : '';
}
// Fonction pour appliquer un coefficient de pondération selon la durée
function getPonderationDuree(month) {
    if (month <= 13)
        return 1;
    else if (month <= 24)
        return 1.008;
    else if (month <= 36)
        return 1.059;
    else if (month <= 48)
        return 1.115;
    else
        return 1.15; // Coefficient par défaut au-delà de 48 mois
}
(_a = document.getElementById('formulaire')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    var mail = getInputValue('mail');
    var entreprise = getInputValue('entreprise');
    var taux = parseFloat(getInputValue('taux'));
    var montant = parseFloat(getInputValue('montant'));
    var month = parseInt(getInputValue('month'));
    var majorationValue = document.getElementById('majoration').value;
    var typeMontant = document.querySelector('input[name="typeMontant"]:checked').value;
    if (!mail || !entreprise || isNaN(taux) || isNaN(montant) || isNaN(month)) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }
    // Calcul du montant TTC
    var montantTTC = typeMontant === 'HT' ? montant * 1.2 : montant;
    // Appliquer le coefficient de pondération basé sur la durée
    var coefficient = getPonderationDuree(month);
    montantTTC = montantTTC * coefficient;
    // Calcul du premier loyer majoré ou non
    var premierLoyer = majorationValue === 'oui' ? (montantTTC / month) * 3 : montantTTC / month;
    // Calcul des mensualités restantes
    var mensualites = (montantTTC - premierLoyer) / (month - 1);
    // Calcul de l'économie d'impôts et du coût réel
    var economieImpots = montantTTC * (taux / 100);
    var coutReel = montantTTC - economieImpots;
    // Affichage des résultats
    document.getElementById('result').style.display = 'block';
    document.getElementById('mailResult').textContent = mail;
    document.getElementById('entrepriseResult').textContent = entreprise;
    document.getElementById('tauxResult').textContent = "".concat(taux, "%");
    document.getElementById('montantResult').textContent = "".concat(montant.toFixed(2), " \u20AC");
    document.getElementById('monthResult').textContent = "".concat(month);
    document.getElementById('majorationResult').textContent = majorationValue === 'oui' ? 'Oui' : 'Non';
    document.getElementById('typeMontantResult').textContent = typeMontant;
    document.getElementById('montantTTCResult').textContent = montantTTC.toFixed(2);
    document.getElementById('premierLoyerResult').textContent = premierLoyer.toFixed(2);
    document.getElementById('mensualitesResult').textContent = mensualites.toFixed(2);
    document.getElementById('economieImpotsResult').textContent = economieImpots.toFixed(2);
    document.getElementById('coutReelResult').textContent = coutReel.toFixed(2);
});
