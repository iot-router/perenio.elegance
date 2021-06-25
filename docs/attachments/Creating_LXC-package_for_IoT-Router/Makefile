include $(TOPDIR)/rules.mk

### LXC Execution Environment name - mandatory.
LXC_EE=bip-brlxc-static-ee
### LXC default name - optional. If it is skipped then the Template name is used as a LXC name.
LXC_DEFAULT_NAME=lxc_example_perl
### LXC configuration
LXC_CONFIG=lxc-package.config

### Packages to be included
PKG_BUILD_DEPENDS:=perl

### Package credential
PKG_NAME:=lxc-package-example-perl
PKG_VERSION:=2021-05-26

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/lxc-package.mk

define Package/$(PKG_NAME)/description
  Test of LXC container build
endef

define Package/$(PKG_NAME)
  DEFAULT:=m
  SECTION:=utils
  CATEGORY:=Utilities
  DEPENDS:=+perl
  TITLE:=Example of LXC-package build (Number Guessing Game using Perl inside)
endef

define Package/$(PKG_NAME)/config
### Configs of packages to be included
	select PACKAGE_perl
	select PACKAGE_perlbase-base
endef

LXC_PREINSTALLED_PACKAGES:=perl_ perlbase-

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/root/test-perl/
	$(CP) files/root/test-perl/* $(1)/root/test-perl/

endef

### Uncomment to use pre-install script
#define Package/$(PKG_NAME)/preinst
#!/bin/sh
#endef

### Uncomment to use post-install script
#define Package/$(PKG_NAME)/postinst
##!/bin/sh
#exit 0
#endef

### Uncomment to use pre-remove script
#define Package/$(PKG_NAME)/prerm
##!/bin/sh
#exit 0
#endef

$(eval $(call BuildLXCPackage,$(PKG_NAME)))

#$(eval $(call BuildPackage,$(PKG_NAME)))
