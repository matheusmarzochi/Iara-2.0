ALTER TABLE "researches" ALTER COLUMN "status" SET DEFAULT 'OPENED';

UPDATE researches
SET status = 'OPENED'
WHERE status = 'CREATED';
