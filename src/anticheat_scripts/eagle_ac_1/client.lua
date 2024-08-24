local setElementData = null

local currentElementDataKey = null
local currentElementDataValue = null

-- Table to store coroutine information
local coroutineMap = {}

function setElementData(element, key, value, synchronize)
    triggerServerEvent("EAGLEELEMENTDATA", getLocalPlayer(), "SET", -1, element, key, value, true)
end

function secureGetELementData(element, key, inherit)
    local co = coroutine.running()
    if not co then
        error("requestDataFromServer must be called within a coroutine")
    end

    local coroutineId = tostring(co)
    coroutineMap[coroutineId] = co

    triggerServerEvent("EAGLEELEMENTDATA", getLocalPlayer(), "GET", coroutineId, element, key, inherit, false)

    return coroutine.yield()
end

addEvent("EAGLEELEMENTDATA:GET", true)
addEventHandler("EAGLEELEMENTDATA:GET", root, function(coId, element, targetElementData)
    local co = coroutineMap[coId]
    if co then
        outputChatBox("targetElementData: " .. targetElementData)
        coroutineMap[coId] = nil
        coroutine.resume(co, targetElementData)
    end
end)


-- getElementData = secureGetELementData

-- addEvent("EAGLEELEMENTDATA:GET", true)
-- addEventHandler("EAGLEELEMENTDATA:GET", localPlayer, function(key, elementData)
--     if key == currentElementDataKey then
--         currentElementDataValue = elementData
--     end
--  end)

-- Debug commands

local counter = 0
addCommandHandler("data", function ()
    local key = "EAGLEDATA"
    counter = counter + 1
    setElementData(localPlayer, key, counter)
end)

getElementData = coroutine.wrap(function ()
    local value = coroutine.wrap(secureGetELementData)(localPlayer, "EAGLEDATA")
    outputChatBox("EAGLEDATA: " .. tostring(value))
end)

addCommandHandler("getdata", function ()
    getElementData()
end)
