#!/bin/bash
export NEXT_SKIP_TURBOPACK=1
exec next dev "$@"
