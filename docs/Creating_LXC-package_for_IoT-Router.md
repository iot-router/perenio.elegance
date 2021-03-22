# Creating LXC-package for IoT-Router

<!-- TOC -->

- [Creating LXC-package for IoT-Router](#creating-lxc-package-for-iot-router)
- [1\. Prepare](#1\-prepare)
    - [1.1. Prepare your Linux system to OpenWRT build](#11-prepare-your-linux-system-to-openwrt-build)
        - [1.1.1 Prepare Ubuntu to OpenWRT build](#111-prepare-ubuntu-to-openwrt-build)
    - [1.2. Get OpenWRT sources and set it up](#12-get-openwrt-sources-and-set-it-up)
    - [1.3. Prepare OpenWRT configuration](#13-prepare-openwrt-configuration)
- [2\. Create LXC-package](#2\-create-lxc-package)
    - [2.1. Create a package dir](#21-create-a-package-dir)
    - [2.2. (Optional) Add supplementary files](#22-optional-add-supplementary-files)
    - [2.3. Create a makefile](#23-create-a-makefile)
        - [2.3.1. Settings to be specified in the Makefile](#231-settings-to-be-specified-in-the-makefile)
        - [2.3.2. Instead of adding the requested packages to the Package/$(PKG\_NAME)/config section of the Makefile (2.3.1 p.3), it is possible to select them manually by:](#232-instead-of-adding-the-requested-packages-to-the-packagepkg_nameconfig-section-of-the-makefile-231-p3-it-is-possible-to-select-them-manually-by)
- [3\. Build](#3\-build)
    - [3.1. Build OpenWRT tools and toolchain](#31-build-openwrt-tools-and-toolchain)
    - [3.2. Build the LXC-package](#32-build-the-lxc-package)
    - [3.3. Get the built LXC-package](#33-get-the-built-lxc-package)
- [4\. Example](#4\-example)
    - [4.1. To build the example:](#41-to-build-the-example)
    - [4.2. To test the example](#42-to-test-the-example)
    - [Attachments:](#attachments)

<!-- /TOC -->


# 1\. Prepare

## 1.1. Prepare your Linux system to OpenWRT build

Your system should be ready for OpenWRT build.  
OpenWRT native build environment is GNU/Linux environment.
Follow the link to setup OpenWRT build system: <https://openwrt.org/docs/guide-developer/build-system/install-buildsystem>


### 1.1.1 Prepare Ubuntu to OpenWRT build
Tested on Ubuntu 20.04.2 LTS 64-bit.
1. Install [Ubuntu 20.04.2 LTS 64-bit](https://releases.ubuntu.com/20.04/ubuntu-20.04.2.0-desktop-amd64.iso)
2. Install [required packages](https://openwrt.org/docs/guide-developer/build-system/install-buildsystem#debianubuntu):
```shell
sudo apt update
sudo apt install build-essential ccache ecj fastjar file g++ gawk gettext git java-propose-classpath libelf-dev libncurses5-dev libncursesw5-dev libssl-dev python python2.7-dev python3 unzip wget python3-distutils python3-setuptools rsync subversion swig time xsltproc zlib1g-dev
```

## 1.2. Get OpenWRT sources and set it up

1. Create a new dir for OpenWRT and change to it.
2. Follow the next command sequence:
```shell
git clone https://github.com/openwrt/openwrt.git
git checkout v18.06.4
./scripts/feeds update
```

## 1.3. Prepare OpenWRT configuration
1. Put the [PEJIR.config](attachments/430637212/PEJIR.config) file to the OpenWRT dir.
2. Follow the next command sequence to prepare OpenWRT configuration:
```shell
cp PEJIR.config .config
make defconfig
```

# 2\. Create LXC-package

## 2.1. Create a package dir
Create dir `package/<package name>`, where *\<package name\>* is your LXC-package name.  
For example:
```shell
cd package/test
```

## 2.2. (Optional) Add supplementary files
Your service may need some additional files. To add them to the LXC-package put these files to the required dir in `package/<package name>/files`
For example, put the file :
```shell
mkdir -p package/test/files/root/test-perl
cp test.perl package/test/files/root/test-perl/
```

## 2.3. Create a makefile
Create a makefile for your LXC-package by the template [Makefile](attachments/430637212/Makefile) and put it to `package/<package name>/Makefile`

### 2.3.1. Settings to be specified in the Makefile
You have to specify the following settings in the Makefile:

1.  (Mandatory) The required Execution Environment name. For example:
    ```makefile
    LXC_EE=bees
    ```
2.  (Optional) The default LXC name. For example:
    ```makefile
    LXC_DEFAULT_NAME=test-perl
    ```
3.  (Optional) The packages to include. For example:
    1.  In the section `Package/$(PKG_NAME)`: 
        ```makefile
        PKG_BUILD_DEPENDS:=perl
        ```
    2.   In the section `Package/$(PKG_NAME)/config`:
        ```makefile
        select PACKAGE_perl
        select PACKAGE_perlbase-base
        ```
    3.  In the section `Package/$(PKG_NAME)/install`: 
        ```makefile
        $(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/packages/perl_*.ipk $(1)/$(LXC_PKG_DIR)
        $(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/packages/perlbase-*.ipk $(1)/$(LXC_PKG_DIR)
        ```
4.  (Optional) The files or dirs to include. For example:
    In the section `Package/$(PKG\_NAME)/install`:  
    ```makefile
    $(INSTALL_DIR) $(1)/root/test-perl/
    $(CP) files/root/test-perl/* $(1)/root/test-perl/
    ```

### 2.3.2. Instead of adding the requested packages to the Package/$(PKG\_NAME)/config section of the Makefile (2.3.1 p.3), it is possible to select them manually by:
```shell
make menuconfig
```
For example, select the required packages as 'M'. For example,
- Languages→Perl→perl
- Languages→Perl→perl→perlbase-base.

# 3\. Build

## 3.1. Build OpenWRT tools and toolchain
```shell
make tools/install
make toolchain/install
```

## 3.2. Build the LXC-package

Build the required packages by the template command:
```shell
make package/<package>/compile
```
For example:
```shell
make package/test/compile
```

## 3.3. Get the built LXC-package

The built package is located in:

    bin/packages/mipsel_24kc/base

For example:

    bin/packages/mipsel_24kc/base/test-lxc_2020-11-10_mipsel_24kc.ipk


# 4\. Example

## 4.1. To build the example:

1.  Perform [section 1 - Prepare](#1\-prepare).

2.  Extract [test-perl.tar.gz](attachments/430637212/test-perl.tar.gz) to
    the root of OpenWRT:

    ```shell
    tar xz -f test-perl.tar.gz ./
    ```

3.  Perform [section 3 - Build](#3\-build).

You should get an LXC-package [test-lxc\_2020-11-10\_mipsel\_24kc.ipk](attachments/430637212/test-lxc_2020-11-10_mipsel_24kc.ipk)

## 4.2. To test the example

1.  Copy the LXC-package to an IoT-Router
2.  At the SSH shell run
    1.  ```shell
        ee-install.sh -p test-lxc_2020-11-10_mipsel_24kc.ipk
        ```

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
    2.  ```shell
        lxc-attach -n test-perl – /root/test-perl/test.perl
        ```
        ```
        root@PEJIR01_ACKf:~# lxc-attach -n test-perl -- /root/test-perl/test.perl
        Hello, world!
        ```

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" data-align="left">

![](images/icons/bullet_blue.gif)
[PEJIR.config](attachments/430637212/PEJIR.config)
(application/octet-stream)  
![](images/icons/bullet_blue.gif)
[Makefile](attachments/430637212/Makefile) (application/octet-stream)  
![](images/icons/bullet_blue.gif)
[test.perl](attachments/430637212/test.perl)
(application/octet-stream)  
![](images/icons/bullet_blue.gif)
[test-perl.tar.gz](attachments/430637212/test-perl.tar.gz)
(application/x-gzip)  
![](images/icons/bullet_blue.gif)
[test-lxc\_2020-11-10\_mipsel\_24kc.ipk](attachments/430637212/test-lxc_2020-11-10_mipsel_24kc.ipk)
(application/octet-stream)  

</div>
