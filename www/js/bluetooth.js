/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var macAddress = "00:21:13:02:C3:4D";
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        // read config example
        console.log(config);
        counter.innerHTML=config.tokenkey;
                
        /*
        $.ajax({
          dataType: "json",
          url: 'config.json',          
          async: false,
          success: function(data) {
            console.log(data);
            config = data;
            statusDiv.innerHTML=data.tokenkey;
          }
        });
        */
        /*
         var reader = new FileReader();
            reader.onload = function (evt) {
                console.log("read success");
                console.log(evt.target.result);
            };
            reader.readAsText('config.json');
          */
          
         /*
        function win(file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                console.log("read success");
                console.log(evt.target.result);
            };
            reader.readAsText(file);
        };

        var fail = function (error) {
            console.log(error.code);
        };

        entry.file(win, fail);
        */


        /*
        jQuery.getJSON("categories.json", function(data){         
            // data is yours parsed object
        });
        */
        
        //app.isBluetooth();
        bluetoothSerial.isEnabled(
          null,
          function(){
            alert("Bluetooth is unable. Please turn on Bluetooth");
        });
        //bluetoothSerial.connect(macAddress, app.onConnect, app.onDisconnect);
   
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    connect: function() {
        bluetoothSerial.connect(macAddress, app.onConnect, app.onDisconnect);
    },
    disconnect: function() {
        bluetoothSerial.disconnect(null, app.onFailure);
    },
    showDeviceList: function() {
    
      bluetoothSerial.isEnabled(
      function(){
        bluetoothSerial.list(
          function( devices ){
            var s = "Paired Bluetooth Device List:\n";
            for( var i = 0; i < devices.length; i++ ){
              s += (i+1) + ". " + devices[i].name + ": " + devices[i].address + "\n";
            }
            alert(s);
            console.log(s);
        });
      },
      function(){
        alert("Bluetooth is unable. Please turn on Bluetooth");
    });

    return true;
    /*
        bluetoothSerial.list(function(devices) {
            devices.forEach(function(device) {
                alert(device.address);
                console.log(device.address);
            })
        }, app.onFailure);
        */
    },
    isBluetooth: function() {
        bluetoothSerial.isEnabled(function(enabled) {
            alert(enabled);
            //console.log(enabled); // true or false
        }, app.onFailure); 
    },
    
    onConnect: function() {
        bluetoothSerial.subscribe("\n", app.onMessage, app.subscribeFailed);
        statusDiv.innerHTML="Connected to " + macAddress + ".";        
    }, 
    onDisconnect: function() {
        alert("Disconnected");
        statusDiv.innerHTML="Disconnected.";
    },
    onFailure: function() {
        alert("Bluetooth is unable. Please turn on Bluetooth");
    },
    onMessage: function(data) {
        counter.innerHTML = data;        
    },
    subscribeFailed: function() {
        alert("subscribe failed");
    },
    sendCommand: function( data ){

        bluetoothSerial.isEnabled(
          function(){
            bluetoothSerial.write( data );
          },
          function(){
            alert("Bluetooth is unable. Please turn on Bluetooth");
        });

        return true;
    }

    
};
