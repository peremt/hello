  var myCharacteristic;
  var deviceName;
  var pressure = new TimeSeries();
  var flow = new TimeSeries();

  function connect() {
    let serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    let characteristicUuid = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
    navigator.bluetooth.requestDevice({filters: [{name: "Y-sensor"}], optionalServices: [serviceUuid]})
    .then(device => {
      log('Connecting...\n');
      deviceName = device.name;
      return device.gatt.connect();
    })
    .then(server => {
      console.log('Getting Service...');
      return server.getPrimaryService(serviceUuid);
    })
    .then(service => {
      console.log('Getting Characteristic...');
      return service.getCharacteristic(characteristicUuid);
    })
    .then(characteristic => {
      myCharacteristic = characteristic;
      return myCharacteristic.startNotifications().then(_ => {
        console.log('> Notifications started');
        log("Connected to: " + deviceName + "\n");
        myCharacteristic.addEventListener('characteristicvaluechanged',
            handleNotifications);
      });
    })
    .catch(error => {
      console.log('Argh! ' + error);
    });
    var chart1 = new SmoothieChart({maxValue:50,minValue:-50,responsive: true,grid:{verticalSections:15}});
    chart1.streamTo(document.getElementById("smoothie-chart1"));
    var chart2 = new SmoothieChart({maxValue:50,minValue:-50,responsive: true,grid:{verticalSections:15}});
    chart2.streamTo(document.getElementById("smoothie-chart2"));
    chart1.addTimeSeries(pressure, {strokeStyle: 'rgba(255, 255, 0, 1)', fillStyle: 'rgba(255, 255, 0, 0.2)', lineWidth: 4 });
    chart2.addTimeSeries(flow, {strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
 }
  function handleNotifications(event) {
    let value = event.target.value;
    a = new TextDecoder().decode(value);
    b = a.split(" ");
    console.log(b);
    pressure.append(new Date().getTime(), b[0]);
    flow.append(new Date().getTime(), b[1]);
  }
  function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); 
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
    }
    return buf;
  }
  function log(str) {
    document.getElementById("term").value += str;
  }