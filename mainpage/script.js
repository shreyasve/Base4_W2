function calculateEmissions() {
    // Get user inputs
    const country = document.getElementById('country').value;
    const distance = document.getElementById('distance').value;
    const electricity = document.getElementById('electricity').value;
    const waste = document.getElementById('waste').value;
    const meals = document.getElementById('meals').value;

    // Normalize inputs
    const normalizedDistance = distance > 0 ? distance * 365 : 0;
    const normalizedElectricity = electricity > 0 ? electricity * 12 : 0;
    const normalizedMeals = meals > 0 ? meals * 365 : 0;
    const normalizedWaste = waste > 0 ? waste * 52 : 0;

    // Calculate carbon emissions
    const transportationEmissions = 0.14 * normalizedDistance;
    const electricityEmissions = 0.82 * normalizedElectricity;
    const dietEmissions = 1.25 * normalizedMeals;
    const wasteEmissions = 0.1 * normalizedWaste;

    // Calculate total emissions
    const totalEmissions = (transportationEmissions + electricityEmissions + dietEmissions + wasteEmissions).toFixed(2);

    // Display results
    document.getElementById('transportation').innerText = `🚗 Transportation: ${transportationEmissions} tonnes CO2 per year`;
    document.getElementById('electricity').innerText = `💡 Electricity: ${electricityEmissions} tonnes CO2 per year`;
    document.getElementById('diet').innerText = `🍽️ Diet: ${dietEmissions} tonnes CO2 per year`;
    document.getElementById('waste').innerText = `🗑️ Waste: ${wasteEmissions} tonnes CO2 per year`;

    document.getElementById('total').innerText = `🌍 Your total carbon footprint is: ${totalEmissions} tonnes CO2 per year`;
    document.getElementById('warning').innerText = "In 2021, CO2 emissions per capita for India was 1.9 tons of CO2 per capita. Between 1972 and 2021, CO2 emissions per capita of India grew substantially from 0.39 to 1.9 tons of CO2 per capita rising at an increasing annual rate that reached a maximum of 9.41% in 2021";
}