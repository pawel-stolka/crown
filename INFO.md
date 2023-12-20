### new NG monorepo
https://nx.dev/getting-started/tutorials/angular-monorepo-tutorial

## material
npx nx g @angular/material:ng-add --project=my-project-name

### sql queries

# 1.select
SELECT *
FROM "Money" m
WHERE (EXTRACT(HOUR FROM "createdAt") = 22 or EXTRACT(HOUR FROM "createdAt") = 23) and EXTRACT(MINUTE FROM "createdAt") = 0


--SELECT * FROM "Money"  LIMIT 100  
/*
SELECT *
FROM "Money" m
WHERE EXTRACT(HOUR FROM "createdAt") IN (22, 23)
*/

/*
--select
SELECT *
FROM "Money" m
WHERE id = '43b304ef-c09c-4e1a-b0a8-70d2700ce449';
--WHERE (EXTRACT(HOUR FROM "createdAt") = 22 or EXTRACT(HOUR FROM "createdAt") = 23) and EXTRACT(MINUTE FROM "createdAt") = 0
*/

# 2.updates

-- test
UPDATE "Money" m
SET "createdAt" = (DATE(m."createdAt" + INTERVAL '1 day') + INTERVAL '12 hours')
WHERE (EXTRACT(HOUR FROM m."createdAt") = 22 or EXTRACT(HOUR FROM m."createdAt") = 23) and EXTRACT(MINUTE FROM m."createdAt") = 0
--LIMIT 1;

--test2
/*
UPDATE "Money" 
SET "createdAt" = (DATE("createdAt" + INTERVAL '1 day') + INTERVAL '12 hours')
"updatedAt" = NOW()
WHERE id = '57dcdea4-1b2a-47e2-9c61-acfcf8d63bd7';
*/

-- update ORDER BY "updatedAt" asc ORDER BY "updatedAt" desc ORDER BY "updatedAt" asc ORDER BY "updatedAt" asc
