# Creating LXC-package for Perenio IoT-Router

  * [**1. Prepare**](#--1-prepare--)
    + [**1.1. Prepare your Linux system to OpenWRT build**](#--11-prepare-your-linux-system-to-openwrt-build--)
    + [**1.2. Get OpenWRT sources and set it up**](#--12-get-openwrt-sources-and-set-it-up--)
    + [**1.3. Prepare OpenWRT configuration**](#--13-prepare-openwrt-configuration--)
  * [**2. Create LXC-package**](#--2-create-lxc-package--)
    + [**2.1. Create dir package/**](#--21-create-dir-package---)
    + [**2.2. (Optional) Add required files to package//files**](#--22--optional--add-required-files-to-package--files--)
    + [**2.3. Create the makefile (package//Makefile) by the template** **Ma kefile**](#--23-create-the-makefile--package--makefile--by-the-template-----ma-kefile--)
      - [**2.3.1. You have to specify the following settings in the Makefile:**](#--231-you-have-to-specify-the-following-settings-in-the-makefile---)
      - [**2.3.2. Instead of adding the requested packages to the Package/$(PKG_NAME)/config section of the Makefile (2.3.1 p.3), it is possible to select them manually by:**](#--232-instead-of-adding-the-requested-packages-to-the-package---pkg-name--config-section-of-the-makefile--231-p3---it-is-possible-to-select-them-manually-by---)
  * [**3. Build**](#--3-build--)
    + [**3.1. Build OpenWRT tools and toolchain**](#--31-build-openwrt-tools-and-toolchain--)
    + [**3.2. Build the LXC-package**](#--32-build-the-lxc-package--)
    + [**3.3. Get the built LXC-package**](#--33-get-the-built-lxc-package--)
  * [**4. Example**](#--4-example--)
    + [**4.1. To build the example:**](#--41-to-build-the-example---)
  * [**5. Files**](#--5-files--)
  
## **1. Prepare**
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



## **2. Create LXC-package**
### **2.1. Create dir package/** 

For example: 

```
cd package/test
```

### **2.2. (Optional) Add required files to package//files** 

For example: 

```
mkdir -p package/test/files/root/test-perl
cp test.perl package/test/files/root/test-perl/
```

### **2.3. Create the makefile (package//Makefile) by the template** **Ma kefile** 

#### **2.3.1. You have to specify the following settings in the Makefile:** 

1. (Mandatory) The required Execution Environment name. For example:
   1. `LXC_EE=bee` 
2. (Optional) The default LXC name. For example: 
   1. `LXC_DEFAULT_NAME=test-perl`
3. (Optional) The packages to include. For example:
   1. In the section `Package/$(PKG_NAME)`: 
      1. `PKG_BUILD_DEPENDS:=perl` 
   2. In the section `Package/$(PKG_NAME)/config`:
      1. select `PACKAGE_perl` 
      2. select `PACKAGE_perlbase-base` 
   3. In the section `Package/$(PKG_NAME)/install`: 
      1. `$(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/packages/perl_*.ipk $(1)/$(LXC_PKG_DIR)` 
      2. `$(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/packages/perlbase-*.ipk $(1)/$(LXC_PKG_DIR)`
4. (Optional) The files or dirs to include. For example:
   1. In the section Package/ \$(PKG\_NAME)/install:
      1. `$(INSTALL\_DIR) $(1)/root/test-perl/`
      2. `$(CP) files/root/test-perl/* $(1)/root/test-perl/`

#### **2.3.2. Instead of adding the requested packages to the Package/$(PKG_NAME)/config section of the Makefile (2.3.1 p.3), it is possible to select them manually by:** 

```
make menuconfig
```

For example:

Select the required packages as 'M'. For example, 

- LanguagesPerlperl 
- LanguagesPerlperlperlbase-base. 

## **3. Build**
### **3.1. Build OpenWRT tools and toolchain** 

```
make tools/install
make toolchain/install
```

### **3.2. Build the LXC-package** 

Build the required packages by the template command: 

```
make package/<package>/compile
```

For example: 

```
make package/test/compile
```

### **3.3. Get the built LXC-package** 

The built package is located in: 

```
bin/packages/mipsel_24kc/base
```

For example: 

```
bin/packages/mipsel_24kc/base/test-lxc_2020-11-10_mipsel_24kc.ipk
```



## **4. Example**
### **4.1. To build the example:** 

1. Perform p.1
2. Extract test-perl.tar.gz to the root of OpenWRT:
   1. `tar xz -f test-perl.tar.gz ./`
3. Perform p.3 

You should get LXC-package `test-lxc_2020-11-10_mipsel_24kc.ipk` 

**4.2. To test the example** 

1. Copy the LXC-package to an IoT-Router 
2. At the SSH shell run 
   1. `ee-install.sh -p test-lxc_2020-11-10_mipsel_24kc.ipk` 
```
root@PEJIR01_ACKf:~# ee-install.sh -p test-lxc_2020-11-10_mipsel_24kc.ipk

LXCPKG_VER=1.0

LXCPKG_EE=bee
LXCPKG_DEFAULT_NAME=test-perl

ee-install(test-perl/bee): Installation started (test-lxc_2020-11-10_mipsel_24kc.ipk)

Installing test-lxc (2020-11-10) to root...

Configuring test-lxc.

Installing perl (5.28.0-2) to root...

Installing perlbase-base (5.28.0-2) to root...

Installing perlbase-config (5.28.0-2) to root...

Installing perlbase-essential (5.28.0-2) to root...

Package perlbase-config (5.28.0-2) installed in root is up to date.

Package perlbase-essential (5.28.0-2) installed in root is up to date.

Configuring perl.

Configuring perlbase-config.

Configuring perlbase-essential.

Configuring perlbase-base.

ee-install(test-perl/bee): Installation done
```

2. `lxc-attach -n test-perl – /root/test-perl/test.perl`


```
root@PEJIR01_ACKf:~# lxc-attach -n test-perl -- /root/test-perl /test.perl

Hello, world!
```

## **5. Files** 

PEJIR.config

Makefile

test.perl

test-perl.tar.gz 

test-lxc_2020-11-10_mipsel_24kc.ipk 

