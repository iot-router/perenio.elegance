# Perenio LXC EE system. User manual

v3.0

<!-- TOC -->

- [1. Introduction](#1-introduction)
    - [1.1 Purposes](#11-purposes)
- [2\. The perenio-ee package](#2\-the-perenio-ee-package)
    - [2.1. Tools](#21-tools)
        - [2.1.1. ee-install.sh](#211-ee-installsh)
            - [2.1.1.1 Usage](#2111-usage)
            - [2.1.1.2 Examples](#2112-examples)
    - [2.2. Templates](#22-templates)
        - [2.2.1. BEE](#221-bee)
            - [2.2.1.1. The LXC overlay rootfs filesystem](#2211-the-lxc-overlay-rootfs-filesystem)
            - [2.2.1.2. The LXC user](#2212-the-lxc-user)
            - [2.2.1.3. Logs and the logrotate service](#2213-logs-and-the-logrotate-service)
            - [2.2.1.4. The LXC wrapper package](#2214-the-lxc-wrapper-package)
        - [2.2.2. BIP-brlan-DHCP-EE](#222-bip-brlan-dhcp-ee)
        - [2.2.3. BIP-brlxc-STATIC-EE](#223-bip-brlxc-static-ee)
        - [2.2.4. IOT-EE](#224-iot-ee)
        - [2.2.5. IOT-IP-EE](#225-iot-ip-ee)
    - [2.3. LXC-package installation process](#23-lxc-package-installation-process)
        - [2.3.1. LXC creation](#231-lxc-creation)
        - [2.3.2. LXC-package contents installation](#232-lxc-package-contents-installation)
        - [2.3.3. Final clean-up](#233-final-clean-up)
- [3\. Prepare an LXC-package](#3\-prepare-an-lxc-package)
    - [3.1. Files](#31-files)
    - [3.2. Packages](#32-packages)
- [4\. LXC-packages Lifecycle Management](#4\-lxc-packages-lifecycle-management)
    - [4.1. CLI management](#41-cli-management)
        - [4.1.1. Install](#411-install)
            - [4.1.1.1. ee-install.sh](#4111-ee-installsh)
        - [4.1.2. Remove](#412-remove)
            - [4.1.2.1. lxc-destroy](#4121-lxc-destroy)
            - [4.1.2.2. opkg remove (for perenio-ee v2.0+)](#4122-opkg-remove-for-perenio-ee-v20)
        - [4.1.3. Start](#413-start)
            - [4.1.3.1. lxc-start](#4131-lxc-start)
        - [4.1.4. Stop](#414-stop)
            - [4.1.4.1. lxc-stop](#4141-lxc-stop)
        - [4.1.5. Update](#415-update)
    - [4.2. Web-interface management](#42-web-interface-management)
    - [4.3. TR-069 management](#43-tr-069-management)
- [Attachments](#attachments)

<!-- /TOC -->





# 1. Introduction

Perenio LXC EE (LinuX Containers Execution Environment) system is a set of tools to manage LXC's in IoT-Router.  
This document describes Perenio LXC EE v3.1.1.

## 1.1 Purposes

Purposes of the Perenio LXC EE are:

1.  To provide an application and service isolation framework based on LXC
    for OpenWRT IoT-Routers. This framework is focused to be used by
    3rd-party developers to provide their services for Perenio
    IoT-Router.
2.  To reduce space occupied by LXCs. OverlayFS provides controlled access to the host filesystem according to LXC's access rights.
3.  To provide a single interface for LXC lifecycle management.
4.  To provide a single-file form for the LXC installation pack.
5.  To provide a single-action flow for an LXC install.
6.  To provide an interface to TR-069 for LXC management.

# 2\. The perenio-ee package

The **perenio-ee** is an OpenWRT package for Perenio IoT-Router that contains a set of LXC EE templates and tools to install LXC-packages.

**LXC-package** is an extended version of the `.ipk` package that contains files, packages, service scripts, and configuration data to create an LXC and install all required stuff there.

LXC-package has to be installed by the [ee-install.sh](#211-ee-installsh) tool only. The opkg tool can't be used for LXC-package install. This is the result of a security-based approach (to avoid run 3rd-party code or scripts on the host system).


## 2.1. Tools

  - **ee-install.sh** - a tool to create an LXC from a template and install the LXC-package into it.

### 2.1.1. ee-install.sh

**ee-install.sh** is a tool to install an LXC-package as a Linux container on the host system.

#### 2.1.1.1 Usage

```shell
ee-install.sh -h|--help | [-n|--name=<name>] [-t|--templ=<template_name>] [--no-destroy] [--decrypt] [-k|--key=<cipher-key>] [[-p|--pkg=]<pkg.ipk>]
```

Where:  
\--name - the name of the created LXC.  
\--template\_name - the name of the template used to create the LXC.  
\--pkg=\<pkg.ipk\> - the path and filename of LXC-package to be installed. If
the LXC-package is specified then the name and the template\_name options can be skipped.  
\--no-destroy - do not destroy an LXC when an error found.  
\--decrypt - decrypt the LXC-package by the device credentials. By default,
`*.ipk` LXC-packages are not encrypted, `*.bin` LXC-packages are encrypted and should be decrypted before install.  
\--key=\<cipher-key\> - the key to decrypt. By default, device
credentials are used.

#### 2.1.1.2 Examples

* Setup the perenio-iot-lxc LXC-package
    ```shell
    ee-install.sh perenio-iot-lxc_2020-11-17_mipsel_24kc.ipk
    ```
* Setup the encrypted perenio-iot-lxc LXC-package
    ```shell
    ee-install.sh perenio-iot-lxc_2020-11-17_mipsel_24kc.bin
    ```
* Setup the perenio-iot-lxc LXC-package named Smart-home
    ```shell
    ee-install.sh -n Smart-home -p perenio-iot-lxc_2020-11-17_mipsel_24kc.ipk
    ```
* Setup an empty iot-ee template
    ```shell
    ee-install.sh -t iot-ee -n empty_iot
    ```


## 2.2. Templates

  - [bee](#221-bee) - Base Execution Environment (BEE). Define an allocation of a minimal set of resources. Can be used for a simple LXC.
  - [bip-brlan-dhcp-ee](#222-bip-brlan-dhcp-ee) - Base Execution Environment that has it's own IP-address obtained by DHCP from br-lan. Based on BEE.
  - [bip-brlxc-static-ee](#223-bip-brlxc-static-ee) - Base Execution Environment that has it's own static IP-address in br-lxc. Based on BEE.
  - [iot-ee](#224-iot-ee) - IoT Execution Environment (IOT-EE). Define an allocation of a set of resources that required for IoT applications. Based on BEE. It provides access to ZigBee and Z-Wave(optional) ports.
  - [iot-ip-ee](#225-iot-ip-ee) - IoT Execution Environment that is based on bip-brlxc-static-ee.

### 2.2.1. BEE

Perenio Base Execution Environment.

The BEE template is a root parent of any other Perenio LXC EE templates. It configures and implements base LXC features, like:

  - The overlay rootfs filesystem.
  - The tmpfs (`/tmp`) filesystem.
  - The LXC user for ACL-based access.
  - The root process (`procd`).
  - The `ubus` service.
  - The `rpcd` service.
  - The `log` service.
  - The `logrotate` service.
  - The `cron` service.
  - The LXC wrapper package for the host opkg.

#### 2.2.1.1. The LXC overlay rootfs filesystem

Perenio LXC EE uses the [overlay](https://en.wikipedia.org/wiki/OverlayFS) rootfs filesystem over the host rootfs. It provides selective access to files in the host filesystem from an LXC. This avoids duplicate files that used on the host and on LXCs. All LXCs can access to the set of permitted original files on the host filesystem. At the same time, it's impossible to change or delete original host files from inside the LXC.  
A set of accessible host filesystem files can be defined individually
for every LXC template.

#### 2.2.1.2. The LXC user

An LXC user is required for ACL-based access to host features from the LCX. Each template specifies its own set of permitted features. 

#### 2.2.1.3. Logs and the logrotate service

Logs are stored in the `/logs/` directory.  
The logrotate service is configured to compress the log when it is larger than 500 kB. The maximum number of compressed logs is 10.  
Log messages from the syslogd's circular buffer can be displayed by the `logread` command or `l` command.  
Log messages from the files in `/logs/` directory can be displayed by the `l -x` command.

#### 2.2.1.4. The LXC wrapper package

This is a special opkg package for the host. It is created and installed during the installation process of an LXC-package based on BEE. It is required to remove LXC-package by the `opkg remove` command.  
The LXC wrapper package includes:
1.  LXC-package description information. It is placed in the
    `/etc/lxc-packages/` directory.
2.  Information that needs to remove LXC-package by `opkg remove`
    command

### 2.2.2. BIP-brlan-DHCP-EE

Base Execution Environment that has it's own IP-address obtained by DHCP from br-lan. It provides an LXC that has a virtual network interface connected to br-lan bridge and get its IP by DHCP. It has IP from the LAN.  
DNS access by the name of LXC is available. It provides network access to the LXC created based on this EE by the name of LXC.  
This execution environment is based on BEE.

### 2.2.3. BIP-brlxc-STATIC-EE

Base Execution Environment that has it's own static IP-address in br-lxc. It provides an LXC that has a virtual network interface connected to br-lxc bridge and gets static IP. It has IP from the LXC network that is based on dedicated br-lxc bridge. By default this network has address 192.168.192.0/24. Routing to/from WAN and LAN is provided by.   
Static address is automatically allocated and assigned to the LXC at the time of LXC creation.  
DNS access by the name of LXC is available. It provides network access to the LXC created based on this EE by the name of LXC.  
This execution environment is based on BEE.  
An additional option - LXC_PROXY - is available for LXC-packages based on this execution environment. It provides HTTP-proxy to redirect HTTP/REST requests of the specified port from the router to the LXC.

### 2.2.4. IOT-EE

Perenio IoT Execution Environment. It is based on BEE. UART ports for ZigBee and Z-Wave as well as Z/IP Gateway support are added. 

### 2.2.5. IOT-IP-EE

Perenio IoT Execution Environment based on bip-brlxc-static-ee. This execution environment is an analogue of IOT-EE but it provides dedicated IP address for inherited LXCs.

## 2.3. LXC-package installation process

### 2.3.1. LXC creation

![](attachments/429293760/438698013.png)

### 2.3.2. LXC-package contents installation

![](attachments/429293760/438698015.png)

### 2.3.3. Final clean-up

![](attachments/429293760/438698014.png)


# 3\. Prepare an LXC-package

An LXC-package is an extension of a regular OpenWRT package. That's why it supports all features of OpenWRT packages.  
The detailed description of the LXC-package creation is available [here](Creating_LXC-package_for_IoT-Router.md) .  
The most useful options are described below.

## 3.1. Files

An LXC-package can contain any files. Just copy them to the LXC-package filesystem in the Makefile.   
For example,
```makefile
 define Package/$(PKG_NAME)/install  
     $(INSTALL_DIR) $(1)/etc  
     $(CP) files/etc/* $(1)/etc/  
     ...  
 endif
```

## 3.2. Packages

An LXC-package can contain a set of packages that should be installed in the LXC. Just copy them to the `/packages/` folder in the Makefile. They are going to be installed to the LXC right after its creation.  
For example,
```makefile
 LXC_PKG_DIR:=packages
 define Package/$(PKG_NAME)/install
     $(INSTALL_DIR) $(1)/$(LXC_PKG_DIR)
     $(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/base/package1.ipk $(1)/$(LXC_PKG_DIR)
     $(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/base/package2.ipk $(1)/$(LXC_PKG_DIR)
 endif
```

# 4\. LXC-packages Lifecycle Management

The following actions are available for LXC-packages:

1.  Install
2.  Remove
3.  Start
4.  Stop
5.  Update

These actions can be done by:

1.  Command-line
2.  Web-interface
3.  TR-069

## 4.1. CLI management

### 4.1.1. Install

#### 4.1.1.1. ee-install.sh

ee-install.sh is an LXC-package management tool from the Perenio-EE package. It creates LXC and installs a specified LXC-package there. 

[Usage](#24-ee-installsh)

### 4.1.2. Remove

> Note: LXC should be stopped before remove (see
[here](#414-stop) for details)

#### 4.1.2.1. lxc-destroy

lxc-destroy is one of the LXC management tools. It removes a specified LXC from the host. According to the BEE template, all created staff (LXC user, LXC wrapper, etc.) is also removed from the host. 

    Usage: lxc-destroy -n NAME
    Options:
        -n, --name=NAME - the name of the container to destroy

#### 4.1.2.2. opkg remove (for perenio-ee v2.0+)

opkg is an OpenWRT package management tool. It removes a specified package from the host. According to the BEE template, all created staff (LXC, LXC user, etc.) is also removed from the host. 

    usage: opkg remove <pkg>
    Remove an LXC-package
        <pkg> - the LXC-package name.
    *NOTE: The LXC-package name is not the LXC-package file name. It is the package name. It can be found by the `opkg list-installed` command.

### 4.1.3. Start

#### 4.1.3.1. lxc-start

lxc-start is one of LXC management tools. It starts a specified LXC.

    Usage: lxc-start -n NAME
    Options:
        -n, --name=NAME - the name of the container to start.

### 4.1.4. Stop

#### 4.1.4.1. lxc-stop

lxc-stop is one of the LXC management tools. It stops a specified LXC.

    Usage: lxc-stop -n NAME
    Options:
        -n, --name=NAME   NAME of the container to stop

### 4.1.5. Update

lxc-attach is one of the LXC management tools. It runs a specified command in a specified LXC.

    lxc-attach -n <name> -- opkg update <LXCpackage>

## 4.2. Web-interface management

All required actions (install, remove, start, stop) can be done by the web interface. The `Service`→`LXC packages` menu should be used:

![](attachments/429293760/435487607.png)

## 4.3. TR-069 management

All required actions (install, remove, start, stop) can be done remotely by the ACS using TR-069. The ChangeDUState path should be used. For example:

![](attachments/429293760/435487610.png)


# Attachments

![](images/icons/bullet_blue.gif) [Screenshot 2021-01-22 at
11.47.09.png](attachments/429293760/435487607.png) (image/png)  
![](images/icons/bullet_blue.gif) [Screenshot 2021-01-22 at
11.52.21.png](attachments/429293760/435487610.png) (image/png)  
![](images/icons/bullet_blue.gif) [Page 1.png](attachments/429293760/438698013.png) (image/png)  
![](images/icons/bullet_blue.gif) [Page 2.png](attachments/429293760/438698015.png) (image/png)  
![](images/icons/bullet_blue.gif) [Page 3.png](attachments/429293760/438698014.png) (image/png)  
