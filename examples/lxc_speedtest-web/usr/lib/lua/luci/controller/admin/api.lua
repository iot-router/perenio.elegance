----------------------------------------------------------------------------
-- API controller 
-- Copyright Perenio IoT (C) 2019 
--
-- Author: Stan Hrynsphun 
---------------------------------------------------------------------------
module("luci.controller.admin.api", package.seeall)

local log = require "logging"

local http = require "luci.http"

local fs = require "nixio.fs"

local nixio = require "nixio"

function index()

    entry({"admin", "api"})
    
    entry({"admin", "api", "v1"})
    
    entry({"admin", "api", "v1", "file-upload"}, call("uploadFile"))

end 

function uploadFile()

    local formvalue = luci.http.formvalue("file")

    local file_tmp = '/tmp/%s' % formvalue.file

    local fp

    local ok, message = pcall(http.setfilehandler, function(meta, chunk, eof)

        if not fp and meta and meta.name == "file" then
            fp = io.open(file_tmp, "w")
        end

        if fp and chunk then fp:write(chunk) end

        if fp and eof then fp:close() end
    end)

    if not ok then
        
        luci.http.write_json({ result = false, message = message })

        return 
    end

    luci.http.write_json({ result = true })

end