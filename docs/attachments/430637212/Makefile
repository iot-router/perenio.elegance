include $(TOPDIR)/rules.mk

### LXC Execution Environment name - mandatory.
LXC_EE=bee
### LXC default name - optional. If it is skipped then the Template name is used as a LXC name.
LXC_DEFAULT_NAME=test-perl

### Package credential
PKG_NAME:=test-lxc
PKG_VERSION:=2020-11-10

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)/description
  Test of LXC container build
endef

define Package/$(PKG_NAME)
  DEFAULT:=m
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Test of LXC container build
### Packages to be included
  PKG_BUILD_DEPENDS:=perl
endef

define Package/$(PKG_NAME)/config
### Configs of packages to be included
	select PACKAGE_perl
	select PACKAGE_perlbase-base
endef

define Build/Compile
endef

LXC_PKG_DIR:=packages

define Package/$(PKG_NAME)/preinst
#!/bin/sh
LXCPKG_VER=1.0
LXCPKG_EE=$(LXC_EE)
LXCPKG_DEFAULT_NAME=$(LXC_DEFAULT_NAME)
### Uncomment the line below to forbid using different template.
#[ "$$TMPL" != "$$LXCPKG_EE" ] && { echo "$(PKG_NAME): Wrong execution environment (template)"; exit 1; }

exit 0
endef

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


define Package/$(PKG_NAME)/install
### Uncomment to install additional files
	$(INSTALL_DIR) $(1)/root/test-perl/
	$(CP) files/root/test-perl/* $(1)/root/test-perl/

	$(INSTALL_DIR) $(1)/$(LXC_PKG_DIR)
### Packages files to include
	$(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/packages/perl_*.ipk $(1)/$(LXC_PKG_DIR)
	$(CP) $(OUTPUT_DIR)/packages/$(ARCH_PACKAGES)/packages/perlbase-*.ipk $(1)/$(LXC_PKG_DIR)

endef

$(eval $(call BuildPackage,$(PKG_NAME)))
