let allData = [];
let singleDist = [];
let selectDist = '';
let household_ordinary_f = 0;
let household_ordinary_m = 0;
let household_single_f = 0;
let household_single_m = 0;
let household_f = [household_ordinary_f, household_single_f];
let household_m = [household_ordinary_m, household_single_m];


async function getData() {
    let data = await fetch('https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/110');
    data = await data.json();
    allData = [...data.responseData];
    console.log(allData);

    allData.map((item, index, self) => {
        if (singleDist.indexOf(item.site_id) === -1) {
            singleDist.push(item.site_id);
        }
    })

    let selection = document.querySelector('#dist');
    singleDist.map(i => {
        let option = document.createElement('option');
        option.value = i;
        option.innerText = i;
        selection.appendChild(option);
    })
}
getData();

function drawChart(household_f, household_m) {
    let chartContent = document.querySelector('.chartContent');
    let oldCanvas = document.querySelector('canvas');
    chartContent.removeChild(oldCanvas);

    let newCanvas = document.createElement('canvas');
    chartContent.appendChild(newCanvas);

    let ctx = document.querySelector("canvas");
    let livingType = ["共同生活戶", "獨立生活戶"];
    let populationChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: livingType,
            datasets: [
                {
                    label: '女性',
                    data: household_f,
                    backgroundColor: "rgb(255, 102, 102,0.8)",
                    borderColor: "rgb(255, 102, 102)",
                    borderWidth: 1
                },
                {
                    label: '男性',
                    data: household_m,
                    backgroundColor: "rgba(37, 150, 190,0.8)",
                    borderColor: "rgba(14,72,100,1.0)",
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    maxBarThickness: 80,// number (pixels)
                }]
            },
            responsive: true,
            maintainAspectRatio: true
           
        }
    })
}


// getData();
drawChart(household_f,household_m);

document.getElementById('dist').addEventListener('change', () => {
    selectDist = document.getElementById('dist').value;

    selectDistData = allData.filter(e => e.site_id === selectDist);
    selectDistData.forEach(ele => {
        household_ordinary_f += parseInt(ele.household_ordinary_f);
        household_ordinary_m += parseInt(ele.household_ordinary_m);
        household_single_f += parseInt(ele.household_single_f);
        household_single_m += parseInt(ele.household_single_m);
    });

    let household_f = [household_ordinary_f, household_single_f];
    let household_m = [household_ordinary_m, household_single_m];

    drawChart(household_f,household_m);

})
