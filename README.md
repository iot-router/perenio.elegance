# Creating LXC-package for Perenio IoT-Router
  * [1. Prepare](#1-prepare)
    + [**1.1. Prepare your Linux system to OpenWRT build**](#--11-prepare-your-linux-system-to-openwrt-build--)
    + [**1.2. Get OpenWRT sources and set it up**](#--12-get-openwrt-sources-and-set-it-up--)
    + [**1.3. Prepare OpenWRT configuration**](#--13-prepare-openwrt-configuration--)

## 1. Prepare
### **1.1. Prepare your Linux system to OpenWRT build** 

https://openwrt.org/docs/guide-developer/build-system/install-buildsystem 

### **1.2. Get OpenWRT sources and set it up** 

```
git clone https://github.com/openwrt/openwrt.git
git checkout v18.06.4
./scripts/feeds updat
```

### **1.3. Prepare OpenWRT configuration** 

```
cp PEJIR.config .config
make defconfig
```
