# LXC-package encryption

Before sending an LXC-package to a dedicated IoT-Router it can be
encrypted to prevent unallowed usage on another IoT-Router.

To encrypt LXC-package prepcont.sh tool should be used.

# prepcont.sh

## Usage

> 
> 
>     prepcont.sh -h|--help | -k|--key=<cipher-key> [-p|--pkg=<pkg.ipk>] [-o|--out=<output-file>]

Where:

\--key=\<cipher-key\> - a key to decrypt. By default, the device
credentials are used.

\--pkg=\<pkg.ipk\> - path of LXC-package to install. If LXC-package is
specified then name and template\_name can be skipped.

\--out=\<output-file\> - a file to store encrypted LXC-package. It is
recommended to set the ".bin" extension.

## An example

> ./prepcont.sh -k "\<device\_id\>\<model\_key\>" -p \<package.ipk\> -o
> \<package.ipk.bin\>

  

# Installation of encrypted LXC-package

ee-install.sh tool will automatically decrypt an encrypted LXC-package
if its extention is ".bin"
