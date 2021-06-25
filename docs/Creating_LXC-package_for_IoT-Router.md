# Creating LXC-package for IoT-Router

v4.2.1

<!-- TOC -->

- [Creating LXC-package for IoT-Router](#creating-lxc-package-for-iot-router)
- [1\. Prepare](#1\-prepare)
    - [1.1. Prepare your Linux system to OpenWRT build](#11-prepare-your-linux-system-to-openwrt-build)
        - [1.1.1 Prepare Ubuntu to OpenWRT build](#111-prepare-ubuntu-to-openwrt-build)
    - [1.2. Get OpenWRT sources and set it up](#12-get-openwrt-sources-and-set-it-up)
- [2\. Install Perenio-EE SDK](#2\-install-perenio-ee-sdk)
- [3\. Create LXC-package](#3\-create-lxc-package)
    - [3.1. Create a package dir](#31-create-a-package-dir)
    - [3.2. (Optional) Add supplementary files](#32-optional-add-supplementary-files)
    - [3.3. Create a makefile](#33-create-a-makefile)
        - [3.3.1. Settings to be specified in the Makefile](#331-settings-to-be-specified-in-the-makefile)
        - [3.3.2. Settings to be specified in the LXC-package config file](#332-settings-to-be-specified-in-the-lxc-package-config-file)
- [3\. Build](#3\-build)
    - [3.1. Prepare OpenWRT configuration](#31-prepare-openwrt-configuration)
    - [3.2. Build OpenWRT tools and toolchain](#32-build-openwrt-tools-and-toolchain)
    - [3.3. Build the LXC-package](#33-build-the-lxc-package)
    - [3.4. Get the built LXC-package](#34-get-the-built-lxc-package)
- [4\. Example](#4\-example)
    - [4.1. To build the example:](#41-to-build-the-example)
    - [4.2. Test the example](#42-test-the-example)
- [Attachments](#attachments)

<!-- /TOC -->


# 1\. Prepare

## 1.1. Prepare your Linux system to OpenWRT build

Your system should be ready for OpenWRT build.  
The OpenWRT native build environment is GNU/Linux environment. Our recommendation is to use Ubuntu 20.04 [(see the next paragraph)](#111-prepare-ubuntu-to-openwrt-build).  
Follow the link (<https://openwrt.org/docs/guide-developer/build-system/install-buildsystem>) to get detailed information about OpenWRT build system setup.


### 1.1.1 Prepare Ubuntu to OpenWRT build
> Note: Tested on Ubuntu 20.04.2 LTS 64-bit.  

1. Install [Ubuntu 20.04.2 LTS 64-bit](https://releases.ubuntu.com/20.04/ubuntu-20.04.2.0-desktop-amd64.iso)
2. Install [required packages](https://openwrt.org/docs/guide-developer/build-system/install-buildsystem#debianubuntu):
```shell
sudo apt update
sudo apt install build-essential ccache ecj fastjar file g++ gawk gettext git java-propose-classpath libelf-dev libncurses5-dev libncursesw5-dev libssl-dev python python2.7-dev python3 unzip wget python3-distutils python3-setuptools rsync subversion swig time xsltproc zlib1g-dev
```

## 1.2. Get OpenWRT sources and set it up

1. Create a new dir for the OpenWRT root and change to it.
2. Follow the next command sequence:
```shell
git clone https://github.com/openwrt/openwrt.git ./
git checkout v18.06.4
./scripts/feeds update -a
./scripts/feeds install -a
```
3. Replace patch `tools/mkimage/patches/060-remove_kernel_includes.patch` by the updated one from the [openwrt18.04-patch.tar.gz](attachments/Creating_LXC-package_for_IoT-Router/openwrt18.04-patch.tar.gz). Copy this TAR to the OpenWRT root and run a command:
```shell
tar -xzvf openwrt18.04-patch.tar.gz
```
```
lmax@ubuntu:~/work/owrt$ tar -xzvf openwrt18.04-patch.tar.gz
tools/
tools/mkimage/
tools/mkimage/patches/
tools/mkimage/patches/060-remove_kernel_includes.patch
lmax@ubuntu:~/work/owrt$
```

# 2\. Install Perenio-EE SDK

Perenio-EE SDK is available [here](attachments/Creating_LXC-package_for_IoT-Router/perenio-ee_v4.2.1_sdk.tar.gz) in tar.gz file. Copy this TAR to the OpenWRT root and run a command:
```shell
tar -xzvf perenio-ee_v4.2.1_sdk.tar.gz
```
```
lmax@ubuntu:~/work/owrt$ tar -xzvf perenio-ee_v4.0.2_sdk.tar.gz
/
./include/
./include/lxc-package.mk
./PEJIR_SDK.config
./package/
./package/lxc-package_example/
./package/lxc-package_example/files/
./package/lxc-package_example/files/root/
./package/lxc-package_example/files/root/test-perl/
./package/lxc-package_example/files/root/test-perl/test.perl
./package/lxc-package_example/Makefile
./package/lxc-package_example/lxc-package.config
lmax@ubuntu:~/work/owrt$
```

# 3\. Create LXC-package

Perenio-EE SDK contains an LXC-package example `package/lxc-package_example`. It is worth using this example as a source for custom LXC-package.

## 3.1. Create a package dir
Create the `package/<package name>` dir in the OpenWRT root, where *\<package name\>* is your LXC-package name.  
For example:
```shell
mkdir package/lxc-package-example-perl
```
Tip: You can copy the LXC-package example `package/lxc-package_example` to your dir and then update its files and Makefile according to your requirements.

## 3.2. (Optional) Add supplementary files
Your service may need some additional files. To add them to the LXC-package put these files to the required dir in `package/<package name>/files`
For example, to put the [test.perl](attachments/Creating_LXC-package_for_IoT-Router/test.perl) file to the `/root/test-perl` dir in the LXC:
```shell
mkdir -p package/lxc-package-example-perl/files/root/test-perl
cp test.perl package/lxc-package-example-perl/files/root/test-perl/
```

## 3.3. Create a makefile
Create a makefile for your LXC-package by the template [Makefile](attachments/Creating_LXC-package_for_IoT-Router/Makefile) and put it to the `package/<package name>/Makefile` file.

### 3.3.1. Settings to be specified in the Makefile
The developer have to specify the following settings in the Makefile (pay attention - 1,4 and 7 are mandatory):

1.  (Mandatory)  
   The required Execution Environment name. For example:
    ```makefile
    LXC_EE=bee
    ```
    [Available Perenio Execution Environments](Perenio_LXC_EE_system._User_manual.md#22-perenio-execution-environments-templates)
2. (Optional)  
   The default LXC name. This name will be used for LXC operations (start, stop, attach, etc.). Name may contain only `A..Z`, `a..z`, `0..9`, `_` symbols. For example:
    ```makefile
    LXC_DEFAULT_NAME=lxc_example_perl
    ```
    Note: If the default LXC is not specified then the Execution Environment name is used as the default LXC name.
3. (Optional)  
   To configure and use [LXC-package built-in features](Perenio_LXC_EE_system._User_manual.md#23-lxc-package-options), a config-file should be mentioned in LXC_CONFIG variable. This config-file should contain required LXC-package features settings ([see below](#332-settings-to-be-specified-in-the-lxc-package-config-file)).
    ```makefile
    LXC_CONFIG=lxc-package.config
    ```
4. (Mandatory)  
   The LXC-package name. For example:
    ```makefile
    PKG_NAME:=lxc-package-example-perl
    ```
5. (Optional)  
   The packages to include. To include packages to the LXC-package the developer needs to set build dependency, enable required packages in OpenWRT config and specify required packages to copy them into the LXC-package. For example:
    1.  To set build dependency. Out of any section: 
        ```makefile
        PKG_BUILD_DEPENDS:=perl
        ```
    2.  To enable required packages in OpenWRT config. In the section `Package/$(PKG_NAME)/config`:
        ```makefile
        select PACKAGE_perl
        select PACKAGE_perlbase-base
        ```
        > Note: Instead of adding required packages to the `Package/$(PKG_NAME)/config` section of the Makefile, it is possible to select them manually by:
        > ```shell
        > make menuconfig
        > ```
        > For example, select required packages as 'M'. For example,
        > - Languages→Perl→perl
        > - Languages→Perl→perl→perlbase-base.
        >
        > Then save config.


    3.  To specify required packages to copy them into the LXC-package. Out of any section: 
        ```makefile
        LXC_PREINSTALLED_PACKAGES:=perl_ perlbase-
        ```
6. (Optional)  
   Files and/or dirs to include. For example:  
    In the section `Package/$(PKG_NAME)/install`:  
    ```makefile
    $(INSTALL_DIR) $(1)/root/test-perl/
    $(CP) files/root/test-perl/* $(1)/root/test-perl/
    ```

7. (Mandatory)  
   Service lines.  
   Before `Package/*` sections:
    ```makefile
    include $(INCLUDE_DIR)/package.mk
    include $(INCLUDE_DIR)/lxc-package.mk
    ```
    At the end of Makefile:
     ```makefile
    $(eval $(call BuildLXCPackage,$(PKG_NAME)))

    #$(eval $(call BuildPackage,$(PKG_NAME)))
    ```

### 3.3.2. Settings to be specified in the LXC-package config file

The developer can specify the following settings in the config-file:

- [HIDDEN_FILES](Perenio_LXC_EE_system._User_manual.md#231-hidden_files)
- [OPAQUE_DIRS](Perenio_LXC_EE_system._User_manual.md#232-opaque_dirs)
- [SSH](Perenio_LXC_EE_system._User_manual.md#233-ssh)
- [SSH_KEY](Perenio_LXC_EE_system._User_manual.md#234-ssh_key)
- [WEB_HTTP](Perenio_LXC_EE_system._User_manual.md#235-web_http-and-web_https)
- [WEB_HTTPS](Perenio_LXC_EE_system._User_manual.md#235-web_http-and-web_https)
- [PROXY](Perenio_LXC_EE_system._User_manual.md#236-proxy)

Detailed information is available in the User Manual ([2.2. Templates](Perenio_LXC_EE_system._User_manual.md#22-templates), [2.3. LXC-package options](Perenio_LXC_EE_system._User_manual.md#23-lxc-package-options))

# 3\. Build

## 3.1. Prepare OpenWRT configuration
1. Put the [PEJIR.config](attachments/Creating_LXC-package_for_IoT-Router/PEJIR.config) file to the OpenWRT root dir.
2. Follow the next command sequence to prepare OpenWRT configuration:
```shell
cp PEJIR_SDK.config .config
make defconfig
```

## 3.2. Build OpenWRT tools and toolchain
OpenWRT tools and toolchain should be built before the LXC-package build. It should be done only once.
```shell
make tools/install -j1
make toolchain/install -j1
```
> Note: in case of any error, try to add the option `V=s` to the make command lines:
> ```shell
> make tools/install -j1 V=s
> make toolchain/install -j1 V=s
> ```


## 3.3. Build the LXC-package

Build the LXC-package by the command:
```shell
make package/<package name>/compile
```
For example:
```shell
make package/lxc-package-example-perl/compile
```

## 3.4. Get the built LXC-package

LXC-packages have `.ipk` extension. The built LXC-package is located in the `bin/packages/mipsel_24kc/base` dir.  
For example, `bin/packages/mipsel_24kc/base/lxc-package-example-perl_2021-03-18_mipsel_24kc.ipk`.

# 4\. Example

## 4.1. To build the example:

1. Perform the [section 1 - Prepare](#1\-prepare).

2. Perform the [section 2 - Install Perenio-EE SDK](#2\-install-perenio-ee-sdk).

3. Perform the [section 3 - Build](#3\-build) for the `lxc-package-example-perl` package.

4. You should get the LXC-package [lxc-package-example-perl\_2021-05-26\_mipsel\_24kc.ipk](attachments/Creating_LXC-package_for_IoT-Router/lxc-package-example-perl_2021-05-26_mipsel_24kc.ipk)

## 4.2. Test the example

1.  Copy the LXC-package to an IoT-Router.
2.  At the SSH shell run the command:
    1.  Install the LXC-package:
        ```shell
        ee-install /root/lxc-package-example-perl_2021-05-26_mipsel_24kc.ipk
        ```

        ```
        root@PEJIR01_ACKf:~# ee-install lxc-package-example-perl_2021-05-26_mipsel_24kc.ipk
        LXC name: lxc-example-perl
        LXC template: bip-brlxc-static-ee
        (+) SSH=on
        ee-install(lxc-example-perl/bip-brlxc-static-ee): Installation started (lxc-package-example-perl_2021-05-26_mipsel_24kc.ipk)
        SSH-by-password on the port 22.
        Installing lxc-package-example-perl (2021-05-26) to root...
        Configuring lxc-package-example-perl.
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
        Installing lxc-package-example-perl.lxc-example-perl (2021-05-26) to root...
        Configuring lxc-package-example-perl.lxc-example-perl.
        LXCPKG_SSH: 22
        LXC_IP: 192.168.192.3
        ee-install(lxc-example-perl/bip-brlxc-static-ee): Installation done
        root@PEJIR01_ACKf:~#
        ```
    2.  Check the installed LXC:
        ```shell
        lxc-attach -n lxc-example-perl -- /root/test-perl/test.perl
        ```
        ```
        root@PEJIR01_ACKU:~# lxc-attach -n lxc-example-perl -- /root/test-perl/test.perl
        Hello, world! It's a Perl inside an LXC-package

        Number guessing game
        Guess a number (between 0 and 10):
        5
        Your guess was too low, guess a higher number than 5
        8
        Your guess was too low, guess a higher number than 8
        9
        You Guessed Correct!
         The number was 9
        root@PEJIR01_ACKU:~#

        ```


# Attachments

![](images/icons/bullet_blue.gif)
[openwrt18.04-patch.tar.gz](attachments/Creating_LXC-package_for_IoT-Router/openwrt18.04-patch.tar.gz)  
![](images/icons/bullet_blue.gif)
[perenio-ee\_v4.0.2\_sdk.tar.gz](attachments/Creating_LXC-package_for_IoT-Router/perenio-ee_v4.0.2_sdk.tar.gz)  
![](images/icons/bullet_blue.gif)
[Makefile](attachments/Creating_LXC-package_for_IoT-Router/Makefile)  
![](images/icons/bullet_blue.gif)
[test.perl](attachments/Creating_LXC-package_for_IoT-Router/test.perl)  
![](images/icons/bullet_blue.gif)
[lxc-package-example-perl\_2021-05-26\_mipsel\_24kc.ipk](attachments/Creating_LXC-package_for_IoT-Router/lxc-package-example-perl_2021-05-26_mipsel_24kc.ipk)  
