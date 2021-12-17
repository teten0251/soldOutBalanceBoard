let script = document.createElement("script");
script.type = "text/javascript";
script.src = "./data/data.js";
document.body.appendChild(script);

function showChart() {
    let balanceData = window.SOLD_OUT_BALANCE;
    balanceData.sort(function (a, b) {
        if (new Date(a.date) < new Date(b.date)) {
            return 1;
        } else {
            return -1;
        }
    });

    // one day chart
    const oneDayConfig = createConfig(balanceData, 1);
    const oneDayChart = new Chart(
        document.getElementById('oneDayChart'),
        oneDayConfig
    );
    var oneDayBox = document.getElementById("oneDayBox");
    oneDayBox.style.visibility = "visible";

    // one week chart
    const oneWeekConfig = createConfig(balanceData, 7);
    const oneWeekChart = new Chart(
        document.getElementById('oneWeekChart'),
        oneWeekConfig
    );
    var oneWeekBox = document.getElementById("oneWeekBox");
    oneWeekBox.style.visibility = "visible";

    // one month chart
    const oneMonthConfig = createConfig(balanceData, 30);
    const oneMonthChart = new Chart(
        document.getElementById('oneMonthChart'),
        oneMonthConfig
    );
    var oneMonthBox = document.getElementById("oneMonthBox");
    oneMonthBox.style.visibility = "visible";

    // all chart
    // const oneDayConfig = createConfig(balanceData, 1);
    // const oneDayChart = new Chart(
    //     document.getElementById('oneDayChart'),
    //     oneDayConfig
    // );
    // var chartBox = document.getElementById("oneDayBox");
    // chartBox.style.visibility = "visible";
}

function createConfig(balanceData, period) {
    let config = {};
    if (period === 1) {
        const labels = ["売上", "経費", "利益"];
        const data = {
            labels: labels,
            datasets: [{
                label: '直近１日の収支',
                data: [balanceData[0].sales, balanceData[0].expenses, balanceData[0].sales - balanceData[0].expenses],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)'
                ],
                borderWidth: 1
            }]
        };
        config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
        };
    } else {
        const labels = [], salesData = [], expensesData = [], benefitData = [];

        if (balanceData.length < period) {
            period = balanceData.length;
        }

        for (let i = 0; i < period; i++) {
            const n = period - i - 1;
            labels.push(balanceData[n].date);
            salesData.push(balanceData[n].sales);
            expensesData.push(balanceData[n].expenses);
            benefitData.push(balanceData[n].sales - balanceData[n].expenses);
        }

        const data = {
            labels: labels,
            datasets: [
                {
                    label: '売上',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: salesData,
                },
                {
                    label: '経費',
                    backgroundColor: 'rgb(255, 159, 64)',
                    borderColor: 'rgb(255, 159, 64)',
                    data: expensesData,
                },
                {
                    label: '利益',
                    backgroundColor: 'rgb(255, 205, 86)',
                    borderColor: 'rgb(255, 205, 86)',
                    data: benefitData,
                }
            ]
        };
        config = {
            type: 'line',
            data: data,
            options: {}
        };
    }
    return config;
}

