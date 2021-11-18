-- Copyright 2008 Steven Barth <steven@midlink.org>
-- Licensed to the public under the Apache License 2.0.

module("luci.controller.admin.index", package.seeall)

local log = require "logging" 

function index()
	
	local root = node()
	
	if not root.target then
		
		root.target = alias("admin")
		
		root.index = true
	
	end

	local page = node("admin") 
	
	page.target  = firstchild()
	
	page.ucidata = true
	
	page.index = true
	
	entry({"admin", "speedtest"}, template('index')).index = true

end
