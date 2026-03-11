#!/bin/bash

# RDX: Radiant Dexterity - System Root Provisioning
# Target: /rdx (or relative to current workspace)
# Purpose: Creating the operational spine for the DU and the 4-app suite.

ROOT_DIR="./rdx"

echo "🚀 Initializing RDX Spine at $ROOT_DIR..."

# 1. Create Directory Hierarchy
mkdir -p $ROOT_DIR/{repos,todos,suggestions,runbook,telemetry,parts-bin}

# 2. Initialize the Agent Guide (The RDXT Protocol)
cat <<EOF > $ROOT_DIR/README-AI.md
# RDX OPERATOR PROTOCOL (RDXT)
**Operator:** Rajah (Vincent Maurice Radford)
**System Mode:** Production / Build
**Coordination Hub:** Claude (Primary)

## Agent Instructions:
1. ALWAYS check \`rdx/runbook\` for current procedures before execution.
2. Update \`rdx/todos\` status upon completion of any task.
3. Drop optimizations or divergent ideas into \`rdx/suggestions\`.
4. Use established tagging: #sync, #aar, #station-build, #rdx.
EOF

# 3. Create the Initial Runbook
cat <<EOF > $ROOT_DIR/runbook/system-status.md
# Current System State: Bootstrap
Date: $(date +'%Y-%m-%d')
Status: RDX Spine Manifested.
Next Phase: Parts Bin Inventory & DU Integration.
EOF

# 4. Create placeholders for the 4-app tethers
touch $ROOT_DIR/repos/.gitkeep

echo "✅ RDX Spine is live. Folders provisioned and README-AI protocol established."
