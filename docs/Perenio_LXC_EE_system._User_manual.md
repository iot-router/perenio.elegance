# Perenio LXC EE system. User manual

v2.0

<!-- TOC -->

- [1. Introduction](#1-introduction)
    - [1.1 Purposes](#11-purposes)
- [2\. The perenio-ee package](#2\-the-perenio-ee-package)
    - [2.1. Contents of the perenio-ee package](#21-contents-of-the-perenio-ee-package)
        - [2.1.1. Templates:](#211-templates)
        - [2.1.2. Tools:](#212-tools)
    - [2.2. BEE](#22-bee)
        - [2.2.1. The LXC overlay rootfs filesystem](#221-the-lxc-overlay-rootfs-filesystem)
        - [2.2.2. The LXC user](#222-the-lxc-user)
        - [2.2.3. Logs and the logrotate service](#223-logs-and-the-logrotate-service)
        - [2.2.4. The LXC wrapper package](#224-the-lxc-wrapper-package)
    - [2.3. IOT-EE](#23-iot-ee)
    - [2.4. ee-install.sh](#24-ee-installsh)
        - [2.4.1. Usage](#241-usage)
        - [2.4.2. Examples](#242-examples)
            - [2.4.2.1. Setup the perenio-iot-lxc LXC-package](#2421-setup-the-perenio-iot-lxc-lxc-package)
            - [2.4.2.2. Setup the encrypted perenio-iot-lxc LXC-package](#2422-setup-the-encrypted-perenio-iot-lxc-lxc-package)
            - [2.4.2.3. Setup the perenio-iot-lxc LXC-package named Smart-home](#2423-setup-the-perenio-iot-lxc-lxc-package-named-smart-home)
            - [2.4.2.4. Setup an empty iot-ee template](#2424-setup-an-empty-iot-ee-template)
    - [2.5. LXC-package installation](#25-lxc-package-installation)
        - [2.5.1. LXC creation](#251-lxc-creation)
        - [2.5.2. LXC-package contents installation](#252-lxc-package-contents-installation)
        - [2.5.3. Final clean-up](#253-final-clean-up)
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
    - [Attachments:](#attachments)

<!-- /TOC -->


# 1. Introduction

Perenio LXC EE (LinuX Containers Execution Environment) system is a set of tools to manage LXC in IoT-Router.

## 1.1 Purposes

Purposes of the Perenio LXC EE are:

1.  Provide an application and service isolation framework based on LXC
    for OpenWRT IoT-Routers. This framework is focused to be used by
    3rd-party developers to provide their services for Perenio
    IoT-Router.
2.  Reduce space occupied by LXCs.
3.  Provide a single interface for LXC lifecycle management.
4.  Provide a single-file form for the LXC installation pack.
5.  Provide a single-action flow for an LXC install.
6.  Provide an interface to TR-069 for LXC management.

# 2\. The perenio-ee package

The **perenio-ee** is an OpenWRT package for Perenio IoT-Router that
contains a set of LXC EE templates and tools to install LXC-packages.

**LXC-package** is an extended version of the `.ipk` package that
contains files, packages, service scripts, and configuration data to
create a LXC and install all required stuff there.

LXC-package have to be installed
by [ee-install.sh](#24-ee-installsh)  tool
only. The opkg tool can't be used for LXC-package install. This is the
result of a security-based approach (to avoid run 3rd-party code or
scripts on the host system).

## 2.1. Contents of the perenio-ee package

### 2.1.1. Templates:

  - **bee** - Base Execution Environment (BEE). Define an allocation of
    a minimal set of resources. Can be used for a simple LXC.
  - **iot-ee** - IoT Execution Environment (IOT-EE). Defile an
    allocation of a set of resources that required for IoT applications.
    Incapsulate BEE. Includes Zig-Bee and Z-Wave ports.

### 2.1.2. Tools:

  - **ee-install.sh** - a tool to create an LXC from the template and
    install the LXC-package into it.

## 2.2. BEE

Perenio Base Execution Environment.

The BEE template is a root parent of any other Perenio LXC EE templates.
It configure and implement base LXC features, like:

  - The overlay rootfs filesystem.
  - The tmpfs (`/tmp`) filesystem.
  - The LXC user for ACL based access.
  - The root process (`procd`).
  - The `ubus` service.
  - The `rpcd` service.
  - The `log` service.
  - The `logrotate` service.
  - The `cron` service.
  - The LXC wrapper package for the host opkg.

### 2.2.1. The LXC overlay rootfs filesystem

Perenio LXC EE uses [overlay](https://en.wikipedia.org/wiki/OverlayFS)
rootfs filesystem based on the host rootfs. It provides selective access
to files in the host filesystem from an LXC. This avoids duplicating
files that used on the host and on LXCs. All LXCs can access to the set
of permitted original files on the host filesystem. At the same time,
LXC's can't change or delete these files.

A set of accessible host filesystem files can be defined individually
for every LXC template.

### 2.2.2. The LXC user

LXC user is required for ACL based access to the host features from the
LCX. Each template specifies its own set of permitted features. 

### 2.2.3. Logs and the logrotate service

Logs are stored in the `/logs/` directory.

The logrotate service is configured to compress the log when it
is larger than 500 kB. The maximum number of compressed logs is 10.

Log messages from the syslogd's circular buffer can be displayed by the
`logread` command.

Log messages from the files in `/logs/` directory can be displayed by
the `l` command.

### 2.2.4. The LXC wrapper package

This is a special opkg package for the host. It is created and installed
during the installation process of an LXC-package based on BEE. It is
required to remove LXC-package by the `opkg remove` command.

The LXC wrapper package includes:

1.  LXC-package description information. It is placed in the
    `/etc/lxc-packages/` directory.
2.  Information that needs to remove LXC-package by `opkg remove`
    command

## 2.3. IOT-EE

Perenio IoT Execution Environment. It is based on BEE. UART ports for
ZigBee and Z-Wave as well as Z/IP Gateway support are added. 

## 2.4. ee-install.sh

**ee-install.sh** is a tool to install an LXC-package as a Linux
container on the host system.

### 2.4.1. Usage

>
>
>     ee-install.sh -h|--help | [-n|--name=<name>] [-t|--templ=<template_name>] [--no-destroy] [--decrypt] [-k|--key=<cipher-key>] [[-p|--pkg=]<pkg.ipk>]

Where:

\--name - the name of the created LXC.

\--template\_name - name of the template used to create LXC

\--pkg=\<pkg.ipk\> - path and filename of LXC-package to install. If
LXC-package is specified then name and template\_name can be skipped.

\--no-destroy - do not destroy an LXC when an error found.

\--decrypt - decrypt LXC-package by the device credentials. By default,
\*.ipk LXC-packages are not decrypted, \*.bin LXC-packages are decrypted
before install.

\--key=\<cipher-key\> - a key to decrypt. By default, the device
credentials are used.

### 2.4.2. Examples

#### 2.4.2.1. Setup the perenio-iot-lxc LXC-package

    ee-install.sh perenio-iot-lxc_2020-11-17_mipsel_24kc.ipk

#### 2.4.2.2. Setup the encrypted perenio-iot-lxc LXC-package

    ee-install.sh perenio-iot-lxc_2020-11-17_mipsel_24kc.bin

#### 2.4.2.3. Setup the perenio-iot-lxc LXC-package named Smart-home

    ee-install.sh -n Smart-home -p perenio-iot-lxc_2020-11-17_mipsel_24kc.ipk

#### 2.4.2.4. Setup an empty iot-ee template

    ee-install.sh -t iot-ee -n empty_iot



## 2.5. LXC-package installation

### 2.5.1. LXC creation

![](attachments/429293760/438698013.png)

### 2.5.2. LXC-package contents installation

![](attachments/429293760/438698015.png)

### 2.5.3. Final clean-up

![](attachments/429293760/438698014.png)



# 3\. Prepare an LXC-package

LXC-package is an extension of a regular OpenWRT package. That's why it
supports all features of OpenWRT packages.

A detailed description of the LXC-package creation is available
[here](Creating_LXC-package_for_IoT-Router.md).

The most useful options are:

## 3.1. Files

An LXC-package can contain any files. Just copy it to FS in the
Makefile.

For example,

>
>
>     define Package/$(PKG_NAME)/install
>
>     $(INSTALL_DIR) $(1)/etc
>
>     $(CP) files/etc/* $(1)/etc/
>
>     ...
>
>     endif

## 3.2. Packages

An LXC-package can contain a set of packages that should be installed in
an LXC. Just copy it to the /packages/ folder in the Makefile.

For example,

>
>
>     LXC_PKG_DIR:=packages
>
>     define Package/$(PKG_NAME)/install
>
>     $(INSTALL_DIR) $(1)/$(LXC_PKG_DIR)
>
>     $(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/base/package1.ipk $(1)/$(LXC_PKG_DIR)
>
>     $(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/base/package2.ipk $(1)/$(LXC_PKG_DIR)
>
>     endif



# 4\. LXC-packages Lifecycle Management

The following actions is available for LXC-packages:

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

ee-install.sh is an LXC-package management tool from the Perenio-EE
package. It creates LXC and installs a specified LXC-package there. 

[Usage](#24-ee-installsh)

### 4.1.2. Remove

LXC should be stopped before remove (see
[here](#414-stop) for details)

#### 4.1.2.1. lxc-destroy

lxc-destroy is one of the LXC management tools. It removes a specified
LXC from the host. According to the BEE template, all created staff (LXC
user, LXC wrapper, etc.) is also removed from the host. 

>
>
>     Usage: lxc-destroy -n NAME
>     
>     Options :
>       -n, --name=NAME   NAME of the container to destroy

#### 4.1.2.2. opkg remove (for perenio-ee v2.0+)

opkg is an OpenWRT package management tool. It removes a specified
package from the host. According to the BEE template, all created staff
(LXC, LXC user, etc.) is also removed from the host. 

>
>
>     usage: opkg remove <pkg>
>         Remove LXC-package
>         <pkg> - LXC-package name.
>         * NOTE: LXC-package name is not LXC-package file name. It is package name. It can be found by `opkg list-installed` command.

### 4.1.3. Start

#### 4.1.3.1. lxc-start

lxc-start is one of the LXC management tools. It starts a specified LXC.

>
>
>     Usage: lxc-start -n NAME
>     
>     Options :
>       -n, --name=NAME   NAME of the container to start

### 4.1.4. Stop

#### 4.1.4.1. lxc-stop

lxc-stop is one of the LXC management tools. It stops a specified LXC.

>
>
>     Usage: lxc-stop -n NAME
>     
>     Options :
>       -n, --name=NAME   NAME of the container to stop

### 4.1.5. Update

lxc-attach is one of the LXC management tools. It runs a specified
command in a specified LXC.

>
>
>     lxc-attach -n <name> – opkg update <LXCpackage>

## 4.2. Web-interface management

All required actions (install, remove, start, stop) can be done by the
web interface. The \`Service\`→\`LXC packages\` menu should be used:

![](attachments/429293760/435487607.png)

## 4.3. TR-069 management

All required actions (install, remove, start, stop) can be done remotely
by the ACS using TR-069. The ChangeDUState path should be used. For
example:

![](attachments/429293760/435487610.png)



<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" data-align="left">

![](images/icons/bullet_blue.gif) [Screenshot 2021-01-22 at
11.47.09.png](attachments/429293760/435487607.png) (image/png)  
![](images/icons/bullet_blue.gif) [Screenshot 2021-01-22 at
11.52.21.png](attachments/429293760/435487610.png) (image/png)  
![](images/icons/bullet_blue.gif) [Page
1.png](attachments/429293760/438698013.png) (image/png)  
![](images/icons/bullet_blue.gif) [Page
3.png](attachments/429293760/438698014.png) (image/png)  
![](images/icons/bullet_blue.gif) [Page
2.png](attachments/429293760/438698015.png) (image/png)  

</div>
