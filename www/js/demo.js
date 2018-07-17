//https://github.com/zlargon/TestA204/blob/master/source/App.js
enyo.kind({
  name: "App",
  classes: "app enyo-fit",
  components:[
    { tag: "span", content: "Bluetooth Address: " },
    { kind: "onyx.InputDecorator",
      components: [
        { name: "macAddress", kind: "onyx.Input", onchange: "addressChanged" }
    ]},
    { kind: "onyx.Button", content: "Connect", ontap: "connect" },
    { kind: "onyx.Button", content: "Top",   cmd: "00100000 11010000", ontap: "sendCommand" },
    { kind: "onyx.Button", content: "Down",  cmd: "00100000 11110000", ontap: "sendCommand" },
    { kind: "onyx.Button", content: "Left",  cmd: "00010000 11100000", ontap: "sendCommand" },
    { kind: "onyx.Button", content: "Right", cmd: "00110000 11100000", ontap: "sendCommand" },
    { kind: "onyx.Button", content: "Stop",  cmd: "00100000 11100000", ontap: "sendCommand" },
    { kind: "onyx.Button", content: "Show Device List", ontap: "showDeviceList" }
  ],

  rendered: function(){
    this.inherited(arguments);
    this.$.macAddress.setValue(localStorage.getItem("macAddress"));

    bluetoothSerial.isEnabled(
      null,
      function(){
        alert("Bluetooth is unable. Please turn on Bluetooth");
    });
  },

  addressChanged: function( inSender, inEvent ){
    localStorage.setItem("macAddress", this.$.macAddress.getValue());
    return true;
  },

  connect: function( inSender, inEvent ){

    var address = this.$.macAddress.getValue();
    bluetoothSerial.isEnabled(
      function(){
        bluetoothSerial.connect(address);
      },
      function(){
        alert("Bluetooth is unable. Please turn on Bluetooth");
    });

    return true;
  },

  sendCommand: function( inSender, inEvent ){

    bluetoothSerial.isEnabled(
      function(){
        bluetoothSerial.write( inSender.cmd );
      },
      function(){
        alert("Bluetooth is unable. Please turn on Bluetooth");
    });

    return true;
  },

  showDeviceList: function( inSender, inEvent ){

    bluetoothSerial.isEnabled(
      function(){
        bluetoothSerial.list(
          function( devices ){
            var s = "Paired Bluetooth Device List:\n";
            for( var i = 0; i < devices.length; i++ ){
              s += (i+1) + ". " + devices[i].name + ": " + devices[i].address + "\n";
            }
            alert(s);
        });
      },
      function(){
        alert("Bluetooth is unable. Please turn on Bluetooth");
    });

    return true;
  }
});