      shownRoomDescriptionsRef.current.add(room.id); // mark room seen at least once
      setLastShownRoomDescription(currentDescriptionString);
      // Room entry side-effects (only first time per unique description)
      handleRoomEntry(room, state, dispatch);
      handleRoomEntryForWanderingNPCs(room, state, dispatch);
      onRoomEntry(state, dispatch, room.id, state.previousRoomId);
      const currentZone = room.zone || '';
      const npcsHere = state.npcsInRoom || [];
      if (npcsHere.length > 1) {
        // groupChatLogic preloading removed; module is statically imported where needed
        if (currentZone === 'stantonZone' || currentZone === 'stantonharcourtZone') {
          setTimeout(() => {
            setIsGroupConversation(true);
            setSelectedNPC(npcsHere[0] || null);
            openModal('npcConsole');
          }, 2000);
        }
      }
    }
  }, [room, isDemoActive, dispatch, state]);
