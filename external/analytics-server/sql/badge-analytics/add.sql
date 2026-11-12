/*
 Inserts a new badge analytic record.
 */
INSERT INTO
    badge_analytics(id, tier, app_version, instance)
VALUES
    ($1, $2, $3, $4) RETURNING *
