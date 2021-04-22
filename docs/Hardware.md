# Perenio IoT Router Specification

### 1. Hardware
Name | Type | Value
--- | --- | ---
SoC | must | MT7621A@880MHz
DDR3 RAM | must | 128MB/256MB/512MB
Flash NAND | must | 128MB/256MB/512MB
WAN | must | 1 port
LAN | must | 2 ports
Wi-Fi 2.4 GHz | must | MT7603EN
Wi-Fi 5 GHz | optional | MT7612EN/MT7615N
ZigBee | optional | EFR32MG1P232F256GM48 - @2.4GHz ZigBee Repeater network distance: 100m
Z-Wave | optional | EFR32ZG14P231F256GM32-BR - Sub-GHz frequency bands (865.2 MHz to 926.3 MHz) network distance: 100m
Bluetooth | optional | IEEE 802.15.1, BLE 5.0, nRF52840 network distance: 100m
4G | optional | QUECTEL EC25/EP06
Sim Card Slot | optional | 1x4FF (NanoSim)
Siren | optional | 95 dBI
Buttons | must | Power, WPS, Factory Reset
LEDs | optional | RGB - WiFI 2.4GHz, WiFi 5GHz,ZigBee, Zwave/WWW, Bluetooth/ BMS, Security/WPS, LTE/Battery
Power | must | USB C 5V 3A / 9V 2A / 12V 1.5A
Battery backup | optional | 3. 6V   4000 mAh/8000mAh Li-Pol up to 12 hours

### 2. Interfaces
Name | Type | Value
--- | --- | ---
Wi-Fi | must | 802.11b/g/n, 2 internal antennas  802.11a/n/ac, 2 internal antenna
WAN | must | 1x10/100/1000Mbit
LAN | must | 2x10/100/1000Mbit
Zigbee | optional | IEEE 802.15.4, Repeater, up to 150 connected devices
Z-Wave | optional | Sub-GHz frequency bands (865.2 MHz to 926.3 MHz)
Bluetooth | optional | BLE IEEE 802.15.1
LTE | optional | Bands: B1/B3/B5/B7/B8/B20/B38/B40/B41 - Download speed: 150Mbps/300Mbps - Upload speed: 50Mbps
USB 2.0 | must | supported USB-modem,  File storage, speed up to 480Mb/s
USB 3.0 | must | supported USB-modem,  File storage, speed up to 4,8 Gb/s
SMA | optional | External LTE antenna
Wi-Fi 2.4 GHz | must | Internal - Transmitting power: 20dBm - Receiver sensitivity: -85dBm - Antenna gain: 3dBi

### 3. Antennas
Name | Type | Value
--- | --- | ---
Wi-Fi 5 GHz | must | Internal - Transmitting power: 18 dBm - Receiver sensitivity: -91dBm - Antenna gain: 3dBi
ZigBee | optional | Internal - Transmitting power: 20dBm - Antenna gain: 4dBi
Z-Wave | optional | Internal - Transmitting power: 18dBm - Antenna gain: 3dBi
LTE | optional | Internal: 3dBi - External: 4dBi

### 4. Physical
Name | Value
--- | ---
Product size  (mm) | 142x142x35 mm
GrossWeight  (g) | around 400g (without package)
NetWeight   (g) | 350g

### 5. Power
Name |  Value
--- | ---
Power Supply | Power adapter C/F 100-240VAC, 50/60Hz
Power Consumption | 5W
Rated Power | 3.5W
Max Power | 18W

### 6. Environment
Name | Value
--- | ---
Operate Temperature | 0°C ~ 40°C
Operating Humidity | 5% - 85% RH non-condensing
Storage Temperature | -10°C ~ 60°C
Storage Humidity | 5% - 85% RH non-condensing
IP level | IP30
