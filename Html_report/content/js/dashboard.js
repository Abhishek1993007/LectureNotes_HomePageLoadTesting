/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.66666666666667, "KoPercent": 3.3333333333333335};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9333333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HomePage User: 18"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 19"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 16"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 17"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 5"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 10"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 6"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 11"], "isController": false}, {"data": [0.5, 500, 1500, "HomePage User: 3"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 30"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 4"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 9"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 14"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 15"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 7"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 12"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 8"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 13"], "isController": false}, {"data": [0.0, 500, 1500, "HomePage User: 1"], "isController": false}, {"data": [0.5, 500, 1500, "HomePage User: 2"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 29"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 27"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 28"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 21"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 22"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 20"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 25"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 26"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 23"], "isController": false}, {"data": [1.0, 500, 1500, "HomePage User: 24"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 1, 3.3333333333333335, 319.09999999999997, 227, 1091, 243.0, 716.7000000000007, 980.9999999999999, 1091.0, 3.0187160394445565, 207.72372695084522, 0.3449118912255987], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HomePage User: 18", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 264.66346153846155, 0.439453125], "isController": false}, {"data": ["HomePage User: 19", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 286.8937174479167, 0.47607421875], "isController": false}, {"data": ["HomePage User: 16", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 229.47591145833334, 0.380859375], "isController": false}, {"data": ["HomePage User: 17", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 284.308819731405, 0.4721397210743802], "isController": false}, {"data": ["HomePage User: 5", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 290.220365242616, 0.48210047468354433], "isController": false}, {"data": ["HomePage User: 10", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 286.66585286458337, 0.47607421875], "isController": false}, {"data": ["HomePage User: 6", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 280.8952487244898, 0.4663584183673469], "isController": false}, {"data": ["HomePage User: 11", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 283.20714377572017, 0.47019675925925924], "isController": false}, {"data": ["HomePage User: 3", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 91.83990111815754, 0.15254714619492657], "isController": false}, {"data": ["HomePage User: 30", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 161.54315214201878, 0.26821082746478875], "isController": false}, {"data": ["HomePage User: 4", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 266.77189316860466, 0.442859738372093], "isController": false}, {"data": ["HomePage User: 9", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 263.5184686302682, 0.43776939655172414], "isController": false}, {"data": ["HomePage User: 14", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 292.7775930851064, 0.48620345744680854], "isController": false}, {"data": ["HomePage User: 15", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 279.5946074695122, 0.4644626524390244], "isController": false}, {"data": ["HomePage User: 7", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 297.8938379329004, 0.4946225649350649], "isController": false}, {"data": ["HomePage User: 12", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 285.42774247925314, 0.4740988070539419], "isController": false}, {"data": ["HomePage User: 8", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 264.6859975961538, 0.439453125], "isController": false}, {"data": ["HomePage User: 13", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 274.1144795816733, 0.45521040836653387], "isController": false}, {"data": ["HomePage User: 1", 1, 1, 100.0, 1091.0, 1091, 1091, 1091.0, 1091.0, 1091.0, 1091.0, 0.9165902841429882, 63.12030963565537, 0.10472760082493125], "isController": false}, {"data": ["HomePage User: 2", 1, 0, 0.0, 891.0, 891, 891, 891.0, 891.0, 891.0, 891.0, 1.122334455667789, 77.21419928451178, 0.1282354797979798], "isController": false}, {"data": ["HomePage User: 29", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 290.28629351265823, 0.48210047468354433], "isController": false}, {"data": ["HomePage User: 27", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 248.38884814981947, 0.4124830776173285], "isController": false}, {"data": ["HomePage User: 28", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 288.09819560669456, 0.47806616108786615], "isController": false}, {"data": ["HomePage User: 21", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 289.070706407563, 0.4800748424369748], "isController": false}, {"data": ["HomePage User: 22", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 289.1938025210084, 0.4800748424369748], "isController": false}, {"data": ["HomePage User: 20", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 283.0584490740741, 0.47019675925925924], "isController": false}, {"data": ["HomePage User: 25", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 288.98453912815125, 0.4800748424369748], "isController": false}, {"data": ["HomePage User: 26", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 303.09574614537445, 0.5033383810572687], "isController": false}, {"data": ["HomePage User: 23", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 275.27734375, 0.45703125], "isController": false}, {"data": ["HomePage User: 24", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 288.19626046025104, 0.47806616108786615], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,091 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 100.0, 3.3333333333333335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 1, "The operation lasted too long: It took 1,091 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage User: 1", 1, 1, "The operation lasted too long: It took 1,091 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
