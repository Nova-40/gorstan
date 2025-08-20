# GORSTAN UNUSED CODE PURGE - BASELINE ANALYSIS

Generated: ${new Date().toISOString()}
Phase: 1 - Baseline Inventory (COMPLETE)

## Executive Summary

**Critical Issue Identified:** Massive code debt requiring systematic cleanup
- **366 TypeScript errors** from unused variables/imports (post-strict config)
- **166 unused files** identified by knip analysis
- **287 unused exports** identified by ts-prune analysis
- **Build failing** due to strict TypeScript enforcement

## 1. Knip Analysis Results (Unused Files)

### Files Identified as Unused (166 total):
- **Components:** 32 files including AITestPanel, CreditsScreen, RoomEditor
- **Engine modules:** 47 files including GameEngine, trapController, npcEngine  
- **Utils:** 23 files including validators, state utilities, optimizers
- **Services:** 18 files including AI services, dialogue systems
- **NPCs/Rooms:** 28 files including wandering NPCs, specific room handlers
- **Types/Scripts:** 18 files including type definitions, test scripts

### Dependencies Analysis:
- **6 unused runtime dependencies** requiring cleanup
- **10 unused dev dependencies** requiring cleanup

## 2. TypeScript Prune Analysis (Unused Exports)

### Key Findings from ts-prune:
- **287 unused exports** across engine, components, utils, services
- Major unused export categories:
  - Engine functions (item management, NPC controllers, trap systems)
  - Utility functions (validators, loaders, optimizers)
  - Type definitions and interfaces
  - Component props and hooks
  - Service methods and configuration

### Critical Unused Engine Exports:
- `itemEngine.ts`: default export, multiple item management functions
- `npcEngine.ts`: interactWithNPC, movement controllers
- `sceneEngine.ts`: scene management, optimization analyzers
- `trapEngine.ts`: trap seeding, debug modes, statistics

## 3. Build Analysis (FAILING)

### Current Status: **BUILD BROKEN** ❌
- **366 TypeScript errors** from strict unused parameter enforcement
- Errors span: variables, imports, function parameters, destructured elements
- Major affected areas:
  - NPC conversation system (50+ errors)
  - Room definitions (80+ errors) 
  - Service layer (40+ errors)
  - Engine modules (60+ errors)

### Pre-Cleanup Metrics (Last Successful Build):
- **Bundle Size:** 819.97KB (259KB gzipped)
- **Build Time:** 11.00s
- **Entry Point:** src/main.tsx
- **Total Source Files:** 838+ files

## 4. Duplicate Implementation Detection

### Potential Duplicates Requiring Investigation:
1. **Room Loaders:**
   - `roomLoader.ts` vs `optimizedRoomLoader.ts` vs `roomLoaderFallback.ts`
   - Multiple room loading strategies need consolidation

2. **State Utils:**
   - `src/state/stateUtils.ts` vs `src/utils/stateUtils.ts`
   - Identical utility function implementations

3. **Player State:**
   - `src/state/PlayerState.ts` vs `src/types/PlayerState.ts`
   - Type definition vs implementation overlap

4. **Item Validators:**
   - `itemValidator.ts` vs `globalItemValidator.ts`
   - Different validation approaches for same domain

5. **NPC Memory Systems:**
   - `src/engine/npcMemory.ts` vs `src/npcs/npcMemory.ts`
   - Multiple memory management implementations

6. **Random Utilities:**
   - `src/types/random.d.ts` vs `src/utils/random.ts`
   - Type definitions vs implementations

## 5. Risk Assessment

### High Risk Areas (Require Manual Validation):
- **Dynamic imports:** Files may be loaded at runtime via string interpolation
- **React components:** May be referenced in JSX without direct imports  
- **Engine systems:** Core game logic that may have subtle dependencies
- **Save/load system:** Serialization may depend on specific exports

### Medium Risk Areas:
- **Utility functions:** Many are likely genuinely unused
- **Type definitions:** Safe to remove if no references found
- **Test files:** Can be removed if not in test execution path

### Low Risk Areas:
- **Debug components:** Clearly development-only
- **Example files:** Documentation/example code
- **Duplicate implementations:** One version can be removed safely

## 6. Cleanup Strategy Recommendations

### Phase 2 - Immediate Actions:
1. **Fix TypeScript errors** by removing unused variables/imports (366 errors)
2. **Resolve duplicates** by choosing canonical implementations (6 major conflicts)
3. **Validate dynamic dependencies** for knip-flagged files

### Phase 3 - Systematic Purge:
1. **Remove unused utility files** (low risk, high impact)
2. **Remove unused type definitions** (safe cleanup)
3. **Remove unused dev dependencies** (package.json cleanup)

### Phase 4 - Engine Cleanup:
1. **Audit unused engine exports** (requires careful testing)
2. **Remove unused service layer code** (medium risk)
3. **Clean up component system** (React-specific validation needed)

## 7. Success Metrics Targets

### Build Health:
- ✅ **Zero TypeScript errors** (from 366)
- ✅ **Successful build** (currently failing)
- ✅ **Bundle size reduction** (target: <700KB from 820KB)

### Code Quality:
- ✅ **Zero unused files** (from 166)
- ✅ **Zero unused exports** (from 287)
- ✅ **Single canonical implementations** (resolve 6 duplicates)

### Performance:
- ✅ **Faster build times** (target: <8s from 11s)
- ✅ **Smaller dev bundle** (faster HMR)
- ✅ **Reduced complexity** (fewer files to maintain)

## Next Actions

1. **URGENT:** Fix TypeScript build errors to restore development flow
2. **HIGH:** Resolve duplicate implementations to eliminate confusion  
3. **MEDIUM:** Begin systematic unused file removal starting with low-risk utilities
4. **LOW:** Clean up dependencies and optimize bundle after core cleanup

**Status:** Ready to proceed to Phase 2 - Deduplication and immediate build fixes.
