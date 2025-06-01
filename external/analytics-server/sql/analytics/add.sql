/*
 Inserts a new analytic record.
 */
INSERT INTO
    analytics(id, tier, model, os, app_version, settings, instance)
VALUES
    ($1, $2, $3, $4, $5, $6, $7) RETURNING *
