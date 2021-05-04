const xlabels = [];
const ytemps = [];
chartIt(); 
async function chartIt() {
        await getData();
        const ctx = document.getElementById('chart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xlabels,
                datasets: [
                    {
                        label: 'Combined Land-Surface Air and Sea-Surface Water Temperature in C°',
                        data: ytemps,
                        fill: false,
                        backgroundColor: 'rgba(255, 203, 5, 1)',
                        borderColor: 'rgba(128, 0, 128, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                // Include a celsius symbol in the ticks
                                callback: function(value, index, values) {
                                    return value + '°';
                                }
                            }
                        }
                    ]
                }
            }
        });
    }
// Data from: https://data.giss.nasa.gov/gistemp/
// Mean from: https://earthobservatory.nasa.gov/world-of-
async function getData() {
    const xs = [];
    const ys = [];
const response = await fetch('test.csv');
const data = await response.text();
const table = data.split('\n').slice(1);
table.forEach(row => {
    const columns = row.split(',');
    const year = columns[0];
    xlabels.push(year);
    const temp = columns[1];
    // ys.push(parseFLoat(temp) + 14);
    ytemps.push(parseFloat(temp) + 14);
    console.log(year, temp);
});
return { xs, ys };
}