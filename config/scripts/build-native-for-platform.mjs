#!/usr/bin/env node

// The per-platform native builds this script used to orchestrate (Windows CLI
// launcher, macOS computer-use/keyboard-layout/notification-status helpers)
// were removed with their features. @orca/windows-registry is rebuilt through
// config/scripts/rebuild-native-deps.mjs, so nothing remains to run here.
console.log('[native-build] no platform native builds required')
