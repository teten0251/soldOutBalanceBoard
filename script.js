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
    let oneDayBox = document.getElementById("oneDayBox");
    oneDayBox.style.visibility = "visible";

    // one week chart
    const oneWeekConfig = createConfig(balanceData, 7);
    const oneWeekChart = new Chart(
        document.getElementById('oneWeekChart'),
        oneWeekConfig
    );
    let oneWeekBox = document.getElementById("oneWeekBox");
    oneWeekBox.style.visibility = "visible";

    // one month chart
    const oneMonthConfig = createConfig(balanceData, 30);
    const oneMonthChart = new Chart(
        document.getElementById('oneMonthChart'),
        oneMonthConfig
    );
    let oneMonthBox = document.getElementById("oneMonthBox");
    oneMonthBox.style.visibility = "visible";

    // text box
    let textBox = document.getElementById("textBox");
    textBox.style.visibility = "visible";

    let innerTextBox = document.getElementById("innerTextBox");

    let length = balanceData.length;
    if (length > 30) {
        length = 30;
    }

    for (let i = 0; i < length; i++) {
        let text = "";
        if (balanceData[i].items.length != 0 || balanceData[i].comment) {
            text += "[" + balanceData[i].date + "]";
        }
        if (balanceData[i].items.length != 0) {
            items = "";
            for (let n = 0; n < balanceData[i].items.length; n++) {
                if (n === 0) {
                    items += balanceData[i].items[n];
                } else {
                    items += "/" + balanceData[i].items[n];
                }
            }
            text += " [商品棚]" + items;
        }
        if (balanceData[i].comment) {
            text += " [メモ]" + balanceData[i].comment;
        }
        const p = document.createElement("p");
        p.textContent = text;
        innerTextBox.appendChild(p);
    }

    let oneWeekTable = document.getElementById("oneWeekTable");
    createTableData(oneWeekTable, balanceData, 7);

    let oneMonthTable = document.getElementById("oneMonthTable");
    createTableData(oneMonthTable, balanceData, 30);
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
                    'rgba(132, 162, 212, 0.2)',
                    'rgba(147, 202, 118, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(132, 162, 212)',
                    'rgb(147, 202, 118)'
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
                    backgroundColor: 'rgb(132, 162, 212)',
                    borderColor: 'rgb(132, 162, 212)',
                    data: expensesData,
                },
                {
                    label: '利益',
                    backgroundColor: 'rgb(147, 202, 118)',
                    borderColor: 'rgb(147, 202, 118)',
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

function createTableData(table, balanceData, period) {
    const salesData = [], expensesData = [], benefitData = [];

    if (balanceData.length < period) {
        period = balanceData.length;
    }

    for (let i = 0; i < period; i++) {
        const n = period - i - 1;
        salesData.push(balanceData[n].sales);
        expensesData.push(balanceData[n].expenses);
        benefitData.push(balanceData[n].sales - balanceData[n].expenses);
    }
    const sumSales = salesData.reduce(function (a, b) {
        return a + b;
    });
    const sumExpenses = expensesData.reduce(function (a, b) {
        return a + b;
    });
    const sumBenefit = benefitData.reduce(function (a, b) {
        return a + b;
    });

    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    td1.innerText = "総売上";
    let td2 = document.createElement("td");
    td2.innerText = new Intl.NumberFormat().format(sumSales);

    let td3 = document.createElement("td");
    td3.innerText = "総経費";
    let td4 = document.createElement("td");
    td4.innerText = new Intl.NumberFormat().format(sumExpenses);

    let td5 = document.createElement("td");
    td5.innerText = "総利益";
    let td6 = document.createElement("td");
    td6.innerText = new Intl.NumberFormat().format(sumBenefit);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    table.appendChild(tr);
}
