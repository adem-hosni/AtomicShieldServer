-- anti fly ( you can edit here and add your admins for whitelist )
SPEED_LAST_X = 0;
SPEED_LAST_Y = 0;
SPEED_LAST_Z = 0;
lastTime = 0;
local check = 0;
setTimer(function()
  check = 0
end, 800, 0)

function isElementInAir(element)
    return not isPedOnGround(element) and not getPedContactElement(element)
end

function isPlayerAdmin(player)
    -- Ensure the player argument is valid
    if not player or not isElement(player) or getElementType(player) ~= "player" then
        return false
    end

    -- Check if the player is in the "Admin" ACL group
    local account = getPlayerAccount(player)
    if not account or isGuestAccount(account) then
        return false
    end

    local isAdmin = isObjectInACLGroup("user." .. getAccountName(account), aclGetGroup("Admin"))
    return isAdmin
end

function detectAirBrake()
    if (not isElementInAir(localPlayer)) and (getPedMoveState(localPlayer) == 'fall') then return end
    --   if isPlayerAdmin(localPlayer) return end
    
    local fPx, fPy, fPz = getElementPosition(getLocalPlayer());
    local fVx, fVy, fVz = getElementVelocity(getLocalPlayer());
    if (fPz < 2000) then 
        local time = getTickCount() - lastTime;
        if not (time == 0) then
        local fmVz = (fPz - SPEED_LAST_Z) / time;
        local fMSpeed = getDistanceBetweenPoints3D(SPEED_LAST_X,SPEED_LAST_Y,SPEED_LAST_Z,fPx,fPy,fPz);
        local fVelocity = getDistanceBetweenPoints3D(0,0,0, fVx, fVy, fVz);
        local fSpeedRatio = fMSpeed
        if fSpeedRatio < 0 then
            fSpeedRatio = - fSpeedRatio;
        end
        if (fSpeedRatio > 1.35 and fSpeedRatio < 8) then
            check = check + 1
            if check >= 15 or (check >= 10 and getElementCollisionsEnabled(localPlayer) == false) then       
            triggerServerEvent("EAGLE:BAN", localPlayer, getLocalPlayer(), "CHEATER OUT // AIR-BREAK DETECTED")
            check = 0
            end 
        end
        SPEED_LAST_X = fPx;
        SPEED_LAST_Y = fPy;
        SPEED_LAST_Z = fPz;
        lastTime = getTickCount();
        end
    end
end
addEventHandler("onClientPreRender", root, detectAirBrake)


-- anti godmode
local PlayerHealth = getElementHealth(localPlayer)
addEventHandler("onClientPlayerDamage", localPlayer, function (attacker, weapon, bodypart)
    setTimer(function()
    local NewPlayerHealth = getElementHealth(localPlayer)
    if (NewPlayerHealth == PlayerHealth) and NewPlayerHealth > 0 then 
        triggerServerEvent("EAGLE:BAN", localPlayer, getLocalPlayer(), "CHEATER OUT // INVSCIBLE-MODE DETECTED")
    end
    PlayerHealth = NewPlayerHealth
end,10,1)
end)


Cache = {}
function BasicAimbotChecker(attacker, weapon, bodypart, loss)

    if attacker == getLocalPlayer() then
        if bodypart == 9 then
          
          if not Cache.Numbers then
              Cache.Numbers = 0
          end
          if Cache then
              Cache.Numbers = Cache.Numbers + 1
              setTimer(function()
                  Cache.Numbers = 0
              end, 3000, 1)
              if Cache.Numbers == 5 then
                triggerServerEvent("EAGLE:BAN", localPlayer, getLocalPlayer(), "CHEATER OUT // AIMBOT DETECTED")
              end
          end
        end
    end
end
addEventHandler('onClientPedDamage', getRootElement(), BasicAimbotChecker)
addEventHandler('onClientPlayerDamage', getRootElement(), BasicAimbotChecker)


addEventHandler("onClientPlayerDamage", root, function(attacker, weapon, bodypart, loss)
  if attacker == localPlayer then
      if isElement(source) then
          local elementType = getElementType(source)
          if elementType == "ped" or elementType == "player" or elementType == "object" then
              local x, y, z = getElementPosition(source)  -- Get the position of the damaged element
              local myX, myY, myZ = getElementPosition(localPlayer)
              if not isLineOfSightClear(x, y, z, myX, myY, myZ) then
                triggerServerEvent("EAGLE:BAN", localPlayer, getLocalPlayer(), "CHEATER OUT // BULLET-WALLHACK DETECTED")
              end
          end
      end
  end
end)

addEventHandler("onClientResourceStop", resourceRoot, function(_ARG_0_)
    if string.lower(getResourceName(_ARG_0_)) == string.lower(getThisResource().name) then
        triggerServerEvent("EAGLE:BAN", localPlayer, getLocalPlayer(), "CHEATER OUT // RESOURCE-STOP DETECTED")
      if RESOURCE_STOP_BAN_KICK then
        triggerServerEvent("XoopAc:AcBan", localPlayer)
      else
        triggerServerEvent("XoopAC:AcKick", localPlayer)
      end
    end
  end)

function generate_ban_packet()
    math.randomseed(getTickCount())

    local buffer = {}
    local value = math.random(1, 85)

    -- Ensure value is even
    if value % 2 ~= 0 then
        value = value + 1
    end
    
    buffer[1] = value
    buffer[2] = value * 2
    buffer[3] = math.floor((value * 3) / 2)
    buffer[4] = (value * 3) - buffer[3]
    
    -- Convert buffer to a string (bytes)
    return string.char(buffer[1], buffer[2], buffer[3], buffer[4])
end
  
addCommandHandler("banme", function ()
    outputChatBox("Banme")
    local banBuffer = generate_ban_packet()
    triggerServerEvent(banBuffer, localPlayer)
end)
