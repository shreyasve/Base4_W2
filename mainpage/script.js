function calculateEmissions() {
    const country = document.getElementById('country').value;
    const distance = document.getElementById('distance').value;
    const airdistance = document.getElementById('airdistance').value;
    const electricity = document.getElementById('electricity').value;
    const waste = document.getElementById('waste').value;
    const meals = document.getElementById('meals').value;
    const checkBox = document.getElementById("myCheck");

    const normalizedDistance = distance > 0 ? distance * 365 : 0;
    const normalizedElectricity = electricity > 0 ? electricity * 12 : 0;
    const normalizedMeals = meals > 0 ? meals * 365 : 0;
    const normalizedWaste = waste > 0 ? waste * 52 : 0;

    const transportationEmissions = (0.14 * normalizedDistance) / 1000;
    const electricityEmissions = (0.82 * normalizedElectricity) / 1000;
    const dietEmissions = (1.25 * normalizedMeals) / 1000;
    const wasteEmissions = (0.1 * normalizedWaste) / 1000;
    const airdistanceEmissions = (0.24 * airdistance) / 1000;

    totalEmissions = (
        transportationEmissions +
        electricityEmissions +
        dietEmissions +
        wasteEmissions +
        airdistanceEmissions
    ).toFixed(2);

    if (checkBox.checked == true) {
        totalEmissions = totalEmissions - 0.059;
    }

    document.getElementById('transportation').innerText = `🚗 Transportation: ${transportationEmissions} tonnes CO2 per year`;
    document.getElementById('electricity').innerText = `💡 Electricity: ${electricityEmissions} tonnes CO2 per year`;
    document.getElementById('airdistance').innerText = `✈️ Air Distance: ${airdistanceEmissions} tonnes CO2 per year`;
    document.getElementById('diet').innerText = `🍽️ Diet: ${dietEmissions} tonnes CO2 per year`;
    document.getElementById('waste').innerText = `🗑️ Waste: ${wasteEmissions} tonnes CO2 per year`;

    document.getElementById('total').innerText = `🌍 Your total carbon footprint is: ${totalEmissions} tonnes CO2 per year`;
    document.getElementById('warning').innerText =
        "In 2021, CO2 emissions per capita for India was 1.9 tons of CO2 per capita. Between 1972 and 2021, CO2 emissions per capita of India grew substantially from 0.39 to 1.9 tons of CO2 per capita rising at an increasing annual rate that reached a maximum of 9.41% in 2021";
    
        const xValues = ["Distance", "AirTravelDistance", "Electricity", "Food", "Waste"];
        const yValues = [transportationEmissions, airdistanceEmissions, electricityEmissions, dietEmissions, wasteEmissions];
        const barColors = [
            "#b91d47",
            "#00aba9",
            "#2b5797",
            "#e8c3b9",
            "#1e7145"
        ];
        new Chart("myChart", {
            type: "doughnut",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Your Carbon Emissions"
                }
            }
        });
}
