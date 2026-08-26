"""Shared Pydantic schemas (DTOs).

Canonical home for request/response models that cross layer boundaries.
`wisedeck.api.models` re-exports everything here for backward compatibility;
new code — especially services and database layers — should import from
this package so the dependency graph stays one-directional
(api -> services -> database, with schemas as shared leaf contracts).
"""
