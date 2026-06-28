// Empty-state policy (Component Registry v1.1).
//
// Single source of truth for how the system surfaces a missing real asset.
// EMOVEL rule: a missing required asset must NEVER silently degrade and must
// NEVER be replaced by a fake/placeholder image.
//   - In the Builder canvas and static export, a missing required asset renders
//     the literal MISSING_ASSET_LABEL.
//   - At export time, missing required assets fail explicitly (see
//     assertPageBuilderExportable in static-export.ts).
//
// Pure constant module: no imports, so any layer (React canvas, static export,
// export gate) can depend on it without creating an import cycle.

export const MISSING_ASSET_LABEL = "MISSING ASSET";
