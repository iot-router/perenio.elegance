# Creating LXC-package for IoT Router

v5.1.0

<!-- TOC -->

- [Creating LXC-package for IoT Router](#creating-lxc-package-for-iot-router)
- [1\. Prepare](#1\-prepare)
    - [1.1 Prepare your Linux system for OpenWRT build](#11-prepare-your-linux-system-for-openwrt-build)
        - [1.1.1 Prepare Ubuntu for OpenWRT build](#111-prepare-ubuntu-for-openwrt-build)
    - [1.2 Get OpenWRT sources and set it up](#12-get-openwrt-sources-and-set-it-up)
- [2\. Install Perenio-EE SDK](#2\-install-perenio-ee-sdk)
- [3\. Create LXC-package](#3\-create-lxc-package)
    - [3.1 Create a package dir](#31-create-a-package-dir)
    - [3.2 (Optional) Add supplementary files](#32-optional-add-supplementary-files)
    - [3.3 Create a makefile](#33-create-a-makefile)
        - [3.3.1 Settings to be specified in the Makefile](#331-settings-to-be-specified-in-the-makefile)
        - [3.3.2 Settings to be specified in the LXC-package config file](#332-settings-to-be-specified-in-the-lxc-package-config-file)
- [4\. Build](#4\-build)
    - [4.1 Prepare OpenWRT configuration](#41-prepare-openwrt-configuration)
    - [4.2 Build OpenWRT tools and toolchain](#42-build-openwrt-tools-and-toolchain)
    - [4.3 Build the LXC-package](#43-build-the-lxc-package)
    - [4.4 Get the built LXC-package](#44-get-the-built-lxc-package)
- [5\. Example](#5\-example)
    - [5.1 To build the example:](#51-to-build-the-example)
    - [5.2 Test the example](#52-test-the-example)
- [Attachments](#attachments)

<!-- /TOC -->


# 1\. Prepare

## 1.1 Prepare your Linux system for OpenWRT build

Your system should be ready for OpenWRT build.  
The OpenWRT native build environment is GNU/Linux environment. Our recommendation is to use Ubuntu 20.04 [(see the next paragraph)](#111-prepare-ubuntu-to-openwrt-build).  
Follow the link (<https://openwrt.org/docs/guide-developer/build-system/install-buildsystem>) for details on setting up OpenWRT build system.


### 1.1.1 Prepare Ubuntu for OpenWRT build
> Note: Tested on Ubuntu 20.04.2 LTS 64-bit.  

1. Install [Ubuntu 20.04.2 LTS 64-bit](https://releases.ubuntu.com/20.04/ubuntu-20.04.2.0-desktop-amd64.iso)
2. Install [required packages](https://openwrt.org/docs/guide-developer/build-system/install-buildsystem#debianubuntu):
```shell
sudo apt update
sudo apt install build-essential ccache ecj fastjar file g++ gawk gettext git java-propose-classpath libelf-dev libncurses5-dev libncursesw5-dev libssl-dev python python2.7-dev python3 unzip wget python3-distutils python3-setuptools rsync subversion swig time xsltproc zlib1g-dev
```

## 1.2 Get OpenWRT sources and set it up

1. Create a new dir for the OpenWRT root and change to it.
2. Follow the next command sequence:
```shell
git clone https://github.com/openwrt/openwrt.git ./
git checkout v18.06.4
./scripts/feeds update -a
./scripts/feeds install -a
```
2.1. If error `fatal: unable to access 'https://git.openwrt.org/feed/packages.git/': server certificate verification failed. CAfile: none CRLfile: none
failed.` found then disable https:
```shell
git config --global http.sslverify false
```
3. Replace the patch `tools/mkimage/patches/060-remove_kernel_includes.patch` by the updated one from the [openwrt18.04-patch.tar.gz](attachments/Creating_LXC-package_for_IoT-Router/openwrt18.04-patch.tar.gz). Copy this TAR to the OpenWRT root and run a command:
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

Perenio-EE SDK is available [here](attachments/Creating_LXC-package_for_IoT-Router/perenio-ee_v5.1.0_sdk.tar.gz) in tar.gz file. Copy this TAR to the OpenWRT root and run a command:
```shell
tar -xzvf perenio-ee_v5.1.0_sdk.tar.gz
```
```
lmax@ubuntu:~/work/owrt$ tar -xzvf perenio-ee_v5.1.0_sdk.tar.gz
./
./examples/
./examples/lxcpkg-python.tar.gz
./examples/lxcpkg-example-perl.tar.gz
./examples/lxcpkg-speedtest.tar.gz
./PEJIR_SDK.config
./include/
./include/lxc-package.mk
lmax@ubuntu:~/work/owrt$
```

# 3\. Create LXC-package

Perenio-EE SDK contains LXC-package examples in the folder `examples/`. It is worth using any example as a source for your custom LXC-package.

## 3.1 Create a package dir
Create the `package/<package name>` dir in the OpenWRT root. *\<package name\>* is your LXC-package name.  
For example:
```shell
mkdir package/lxcpkg-example-perl
```
Tip: You can copy the LXC-package example `examples/lxcpkg-example-perl` to your dir and then update its files and Makefile according to your requirements.

## 3.2 (Optional) Add supplementary files
Your service may need some additional files. To add them to the LXC-package put these files to the required dir in `package/<package name>/files`
For example, to put the [test.perl](attachments/Creating_LXC-package_for_IoT-Router/test.perl) file to the `/root/test-perl` dir in the LXC:
```shell
mkdir -p package/lxcpkg-example-perl/files/root/test-perl
cp test.perl package/lxcpkg-example-perl/files/root/test-perl/
```

## 3.3 Create a makefile
Create a makefile for your LXC-package using the template [Makefile](attachments/Creating_LXC-package_for_IoT-Router/Makefile) and put it to the `package/<package name>/Makefile` file.

### 3.3.1 Settings to be specified in the Makefile
The developer has to specify the following settings in the Makefile (pay attention - settings 1,2,3 and 8 are mandatory):

1. (Mandatory)  
   The LXC-package name. Name may contain only `A..Z`, `a..z`, `0..9`, `-` symbols. For example:
    ```makefile
    PKG_NAME:=lxcpkg-example-perl
    ```
2. (Mandatory)  
   The LXC-package version. This version is required for the LXC-package update. By default, an LXC-package update is available to higher version of the same LXC-package name. For example:
    ```makefile
    PKG_VERSION:=1.0.0
    ```
3. (Mandatory)  
   The required Execution Environment name. For example:
    ```makefile
    LXC_EE=bip-brlxc-static-ee
    ```
    [Available Perenio Execution Environments](Perenio_LXC_EE_system._User_manual.md#22-perenio-execution-environments-templates)
4. (Optional)  
   The default LXC name. This name will be used for LXC operations (start, stop, attach, etc.). Name may contain only `A..Z`, `a..z`, `0..9`, `_` symbols. For example:
    ```makefile
    LXC_DEFAULT_NAME=example_perl
    ```
    Note: If the default LXC name is not specified then the Execution Environment name is used as the default LXC name.
5. (Optional)  
   To configure and use [LXC-package built-in features](Perenio_LXC_EE_system._User_manual.md#23-lxc-package-options), a config-file should be mentioned in LXC_CONFIG variable. This config-file should contain required LXC-package features settings ([see below](#332-settings-to-be-specified-in-the-lxc-package-config-file)).
    ```makefile
    LXC_CONFIG=lxc-package.config
    ```
6. (Optional)  
   The packages to be included. To include packages to the LXC-package the developer needs to set build dependencies, enable required packages in OpenWRT config and specify packages that have to be copied into the LXC-package. For example:
    1.  To set build dependencies. Out of any section: 
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


    3.  To specify packages that have to be copied into the LXC-package. Prefixes for wildcards should be specified. The whole wildcard format is `<prefix>*`. Out of any section: 
        ```makefile
        LXC_PREINSTALLED_PACKAGES:=perl_ perlbase-
        ```
        This means installing all packages that match wildcards `perl_*` and `perlbase-*`.
7. (Optional)  
   Files and/or dirs to be included. For example:  
    In the section `Package/$(PKG_NAME)/install`:  
    ```makefile
    $(INSTALL_DIR) $(1)/root/test-perl/
    $(CP) files/root/test-perl/* $(1)/root/test-perl/
    ```

8. (Mandatory)  
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

### 3.3.2 Settings to be specified in the LXC-package config file

The developer can specify the following settings in the config file:

- [HIDDEN_FILES](Perenio_LXC_EE_system._User_manual.md#231-hidden_files)
- [OPAQUE_DIRS](Perenio_LXC_EE_system._User_manual.md#232-opaque_dirs)
- [SSH](Perenio_LXC_EE_system._User_manual.md#233-ssh)
- [SSH_KEY](Perenio_LXC_EE_system._User_manual.md#234-ssh_key)
- [WEB_HTTP](Perenio_LXC_EE_system._User_manual.md#235-web_http-and-web_https)
- [WEB_HTTPS](Perenio_LXC_EE_system._User_manual.md#235-web_http-and-web_https)
- [PROXY](Perenio_LXC_EE_system._User_manual.md#236-proxy)

Detailed information is available in the User Manual ([2.2. Templates](Perenio_LXC_EE_system._User_manual.md#22-templates), [2.3. LXC-package options](Perenio_LXC_EE_system._User_manual.md#23-lxc-package-options))

# 4\. Build

## 4.1 Prepare OpenWRT configuration
1. Put the [PEJIR.config](attachments/Creating_LXC-package_for_IoT-Router/PEJIR.config) file to the OpenWRT root dir.
2. Follow the next command sequence to prepare OpenWRT configuration:
```shell
cp PEJIR_SDK.config .config
make defconfig
```

## 4.2 Build OpenWRT tools and toolchain
OpenWRT tools and toolchain should be built before the LXC-package building. It should be done only once.
```shell
make tools/install -j1
make toolchain/install -j1
```
> Note: in case of any error, try to add the option `V=s` to the make command lines:
> ```shell
> make tools/install -j1 V=s
> make toolchain/install -j1 V=s
> ```


## 4.3 Build the LXC-package

Build the LXC-package by the command:
```shell
make package/<package name>/compile
```
For example:
```shell
make package/lxcpkg-example-perl/compile
```

## 4.4 Get the built LXC-package

LXC-packages have `.ipk` extension. The built LXC-package is located in the `bin/packages/mipsel_24kc/base` dir.  
For example, `bin/packages/mipsel_24kc/base/lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk`.

# 5\. Example

## 5.1 To build the example:

1. Perform the [section 1 - Prepare](#1\-prepare).

2. Perform the [section 2 - Install Perenio-EE SDK](#2\-install-perenio-ee-sdk).

3. Extract example sources. For example,

```shell
perenio@ubuntu:~/owrt$ tar -xzvf examples/lxcpkg-example-perl.tar.gz
./
./package/
./package/lxcpkg-example-perl/
./package/lxcpkg-example-perl/files/
./package/lxcpkg-example-perl/files/root/
./package/lxcpkg-example-perl/files/root/test-perl/
./package/lxcpkg-example-perl/files/root/test-perl/test.perl
./package/lxcpkg-example-perl/lxc-package.config
./package/lxcpkg-example-perl/Makefile
perenio@ubuntu:~/owrt$
```

3. Perform the [section 4 - Build](#4\-build) for the `lxcpkg-example-perl` package.

4. You should get the LXC-package [lxcpkg-example-perl\_1.0.0\_mipsel\_24kc.ipk](attachments/Creating_LXC-package_for_IoT-Router/lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk)

## 5.2 Test the example

1.  Copy the LXC-package to an IoT Router.
2.  At the SSH shell run the command:
    1.  Install the LXC-package:
        ```shell
        ee-install /root/lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk
        ```

        ```
        root@SH-04:~# ee-install lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk
        ee-install: lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk processing...
        LXC-package name: lxcpkg-example-perl
        LXC-package version: 1.0.0
        LXC name: example_perl
        LXC template: bip-brlxc-static-ee
        (+) SSH=on
        ee-install(example_perl/bip-brlxc-static-ee): Installation started (lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk)
        Installing lxcpkg-example-perl (1.0.0) to root...
        Configuring lxcpkg-example-perl.
        Installing perl (5.28.0-3) to root...
        Installing perlbase-base (5.28.0-3) to root...
        Installing perlbase-config (5.28.0-3) to root...
        Installing perlbase-essential (5.28.0-3) to root...
        Package perlbase-config (5.28.0-3) installed in root is up to date.
        Package perlbase-essential (5.28.0-3) installed in root is up to date.
        Configuring perl.
        Configuring perlbase-config.
        Configuring perlbase-essential.
        Configuring perlbase-base.
        Installing lxcpkg-example-perl.example_perl (1.0.0) to root...
        Configuring lxcpkg-example-perl.example_perl.
        Final LXC-package config:
            lxcpkg.example_perl=bip-brlxc-static-ee
            lxcpkg.example_perl.lxcpkg_name='lxcpkg-example-perl'
            lxcpkg.example_perl.lxcpkg_version='1.0.0'
            lxcpkg.example_perl.lxcpkg_file='lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk'
            lxcpkg.example_perl.AUTOSTART='1'
            lxcpkg.example_perl.overlayfs='/overlay/lxc/example_perl'
            lxcpkg.example_perl.SSH='22'
            lxcpkg.example_perl.ip='192.168.192.2'
            lxcpkg.example_perl.hostpkg='lxcpkg-example-perl.example_perl'
        ee-install(example_perl/bip-brlxc-static-ee): Installation done
        root@SH-04:~#
        ```
    2.  Check the installed LXC:
        ```shell
        lxc-attach -n example_perl -- /root/test-perl/test.perl
        ```
        ```
        root@SH-04:~# lxc-attach -n example_perl -- /root/test-perl/test.perl
        Hello, world! It's a Perl inside an LXC-package

        Number guessing game
        Guess a number (between 0 and 10):
        3
        Your guess was too low, guess a higher number than 3
        6
        Your guess was too low, guess a higher number than 6
        8
        You Guessed Correct!
         The number was 8
        root@SH-04:~#

        ```


# Attachments

![](images/icons/bullet_blue.gif)
[openwrt18.04-patch.tar.gz](attachments/Creating_LXC-package_for_IoT-Router/openwrt18.04-patch.tar.gz)  
![](images/icons/bullet_blue.gif)
[perenio-ee\_v4.2.1\_sdk.tar.gz](attachments/Creating_LXC-package_for_IoT-Router/perenio-ee_v5.1.0_sdk.tar.gz)  
![](images/icons/bullet_blue.gif)
[Makefile](attachments/Creating_LXC-package_for_IoT-Router/Makefile)  
![](images/icons/bullet_blue.gif)
[test.perl](attachments/Creating_LXC-package_for_IoT-Router/test.perl)  
![](images/icons/bullet_blue.gif)
[lxcpkg-example-perl\_1.0.0\_mipsel\_24kc.ipk](attachments/Creating_LXC-package_for_IoT-Router/lxcpkg-example-perl_1.0.0_mipsel_24kc.ipk)  
