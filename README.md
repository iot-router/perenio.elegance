# Perenio's Developer Guides for the "Elegance" IoT Router

> ***Preface:** [Perenio](https://perenio.com/) supports the approaches and principles laid down in the [IoT Convention](https://iot-router.github.io/). With the IoT router "Elegance" we want to contribute to the idea of multi-purpose consumer platforms based on Openwrt and want to support interested developers to virtualize and containerize their apps and services for the IoT router "Elegance" as easily as possible.*

<div align="center">
<img src=/assets/elegance-iot-router.jpg >
<p>Perenio's Multifunction IoT Router "Elegance"</p>
</div>

## Welcome to the Perenio developer guides

These documents and references show you how to port or create Openwrt apps, using the APIs in the Perenio framework and other libraries, "LXC (Linux Container)" suitable and executable for the IoT router "Elegance".

If you are brand new to Openwrt and want to jump into your first code, start with the tutorial ["Hello, world!" for OpenWrt](https://openwrt.org/docs/guide-developer/helloworld/start).

And check out these other resources to learn Openwrt development:

- **LABS**: Short self-paced tutorials, each covering a specific topic. Most labs walk you step-by-step through the process of building a small app or adding a new feature to an existing app.

- **COURSES**: Guided training paths that teach you how to build Openwrt apps.

Otherwise, here is a small selection of essential developer guides as well as the Perenio specific information you should know.

## Essential Documentation *(coming soon)*

- [Getting clarity about the available hardware components.](/docs/)
  - Get an overview of the system structure, the components used and the associated application possibilities.
- [Knowing the pre-installed software stacks and libraries of the Perenio Elegance IoT Router.](/docs/pre-installed_software_list.md)
  - Get familiar with the existing software parts, so that good things do not have to be invented again.
- [Understanding Perenio's LXC EE System.](/docs/Perenio_LXC_EE_system._User_manual.md)
  - The LXC EE (LinuX Containers Execution Environment) system is a set of tools for managing LXC and Apps in the IoT router.
- [Creating LXC Packages for Perenio IoT Router.](/docs/Creating_LXC-package_for_IoT-Router.md)
  - How to prepare, create and deploy ready to use LXC packages for Openwrt.
- [Encrypting LXC Packages (optional).](/docs/LXC-package_encryption.md)
  - Before a LXC package is sent to a dedicated IoT router, it can be encrypted to prevent unauthorized use on another IoT router.
- [More to come.](/docs/more-details-to-come.png)
  - Whatever is needed additionally ...

## How do I distribute my LXC Application Packages to my users' Perenio IoT router(s)?

### Option 1: Direct local loading via the WEB interface of the router

**Preparation:**
- Send your "application package" via data transfer to your user(s)

**User installation process:**
- Go to **`Services`** section on the router WEB UI
- Select the **`Load Application Package`** option and enter the "Application Package" location in the provided field
- Start the loading and installation process by clicking the  **`Start`** button
- Done and have fun with it!

### Option 2: Over-The-Air (OTA) loading via the WEB interface of the router

**Preparation** *(only once for the application package provider)***:**
- Send your application package to the Perenio Developer Service
- Wait for the feedback that your application package is included in the Perenio OTA service
- Inform your users about the availability of your application package in the Perenio OTA service

**User installation process:**
- Go to the **`Services`** section on the router WEB UI
- Select the **`Load Application Package`** option and click on the icon of the desired "Application Package"
- Start the loading and installation process by clicking the **`Start`** button
- Done and have fun with it!

## How do I get a Perenio Developer Kit?

If you are interested in either porting your existing application in a Linux container on the Perenio IoT Router or developing new applications for it Perenio Developer Kit, then you will find the necessary information **[here](docs/How_to_buy.md)**.

- [How to buy a test sample!](docs/How_to_buy.md)

## We are looking forward to your feedback!

If you are missing a point in Perenio's Developer Guides, something is unclear and needs better documentation, or you have a better solution for a current requirement: Let us know!

- [Raise an Issue!](https://github.com/iot-router/perenio.elegance/issues/new/choose)

## Case Studies & Success Stories

We also like to share your case studies and success stories with their experiences.
Get in touch and tell us what results you have achieved with which applications!

- [Get in touch!](https://github.com/iot-router/perenio.elegance/issues/new/choose)
