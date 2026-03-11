#!/bin/bash

# =====================================================================
# Lattice Transfer Protocol: Assembling the DU Workbench Console
# Operator: Rajah | Date: 03-10-2026
# =====================================================================

TARGET="workbench/DU/entry-suite"

echo "[*] Initiating parts-bin harvest..."
echo "[*] Target Environment: $TARGET"

# Ensure target integration directories exist
mkdir -p "$TARGET/apps/rhxtm-console"
mkdir -p "$TARGET/apps/flowtracker"
mkdir -p "$TARGET/packages/sessions"

# 1. Transfer RHXTM (The Glass / Telemetry)
if [ -d "workbench/RHXTM" ]; then
    echo "[+] Migrating RHXTM into apps/rhxtm-console..."
    cp -r workbench/RHXTM/* "$TARGET/apps/rhxtm-console/"
else
    echo "[-] WARNING: workbench/RHXTM not found."
fi

# 2. Transfer Flowtracker (The Input UI)
if [ -d "station/flowtracker" ]; then
    echo "[+] Migrating Flowtracker into apps/flowtracker..."
    cp -r station/flowtracker/* "$TARGET/apps/flowtracker/"
else
    echo "[-] WARNING: station/flowtracker not found."
fi

# 3. Transfer Sessions (The Engine & RSS Generator)
if [ -d "rdsys/packages/sessions" ]; then
    echo "[+] Migrating Sessions logic into packages/sessions..."
    cp -r rdsys/packages/sessions/* "$TARGET/packages/sessions/"
else
    echo "[-] WARNING: rdsys/packages/sessions not found."
fi

echo "[*] Transfer complete. The pieces are on the board."
echo "[*] Next objective: Wire the RSS feed inside packages/sessions."
